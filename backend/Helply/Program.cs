using Helply.Auth;
using Helply.Consumers;
using Helply.Files;
using Helply.Hubs;
using Helply.MessagingContracts;
using Helply.Models.Db;
using Helply.Repository;
using Helply.SignalR;
using MassTransit;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

namespace Helply;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.Services.AddControllers();

        builder.Services.AddDbContext<AppDbContext>(options => options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();

        builder.Services.AddOptions<JwtOptions>()
            .Bind(builder.Configuration.GetSection("Jwt"))
            .ValidateDataAnnotations()
            .ValidateOnStart();

        builder.Services.AddOptions<RabbitMqTransportOptions>()
            .BindConfiguration(nameof(RabbitMqTransportOptions))
            .ValidateDataAnnotations()
            .ValidateOnStart();

        builder.Services.AddScoped<IJwtTokenService, JwtTokenService>();
        builder.Services.AddScoped<IRefreshTokenService, RefreshTokenService>();
        builder.Services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();
        builder.Services.AddSingleton<IUserIdProvider, UserIdProvider>();
        builder.Services.AddSingleton<IFileManager, FileManager>();

        ConfigureJWT(builder);

        builder.Services.AddSignalR(o =>
        {
            o.KeepAliveInterval = TimeSpan.FromSeconds(15);
            o.ClientTimeoutInterval = TimeSpan.FromSeconds(60);
        });

        ConfigureRabbitMq(builder);
        UseSerilog(builder);
        AddCorsPolicy(builder);

        var app = builder.Build();

        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseCors("spa");

        app.UseAuthentication();
        app.UseAuthorization();

        app.MapControllers();
        app.MapHub<NotificationsHub>("/hubs/notifications");

        using (var scope = app.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            db.Database.Migrate();
        }

        app.Run();
    }

    private static void ConfigureJWT(WebApplicationBuilder builder)
    {
        var jwtOptions = builder.Configuration.GetSection("Jwt").Get<JwtOptions>() ?? throw new ValidationException("Missing Jwt configuration section.");

        JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();

        builder.Services
            .AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.MapInboundClaims = false;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwtOptions.Issuer,
                    ValidAudience = jwtOptions.Audience,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions.Key)),
                    ClockSkew = TimeSpan.Zero,
                    NameClaimType = JwtRegisteredClaimNames.Sub,
                    RoleClaimType = System.Security.Claims.ClaimTypes.Role
                };

                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        var accessToken = context.Request.Query["access_token"];
                        var path = context.HttpContext.Request.Path;
                        if (!string.IsNullOrEmpty(accessToken) && (path.StartsWithSegments("/hubs/notifications")))
                        {
                            context.Token = accessToken;
                        }
                        return Task.CompletedTask;
                    }
                };
            });

        builder.Services.AddAuthorization();
    }

    private static void ConfigureRabbitMq(WebApplicationBuilder builder)
    {
        builder.Services.AddMassTransit(x =>
        {
            x.AddConsumers(typeof(Program).Assembly);

            x.UsingRabbitMq((context, cfg) =>
            {
                var opt = context.GetRequiredService<IOptions<RabbitMqTransportOptions>>().Value;

                cfg.Host(opt.Host, opt.Port, opt.VHost, h =>
                {
                    h.Username(opt.User);
                    h.Password(opt.Pass);
                });

                cfg.Message<TicketStatusChanged>(m => m.SetEntityName("ticket_status_changed"));
                cfg.Message<TicketCommentAdded>(m => m.SetEntityName("ticket_comment_added"));
                cfg.Message<TicketAssigned>(m => m.SetEntityName("ticket_assigned"));
                cfg.Message<TicketNotification>(m => m.SetEntityName("ticket_notification_created"));

                cfg.ReceiveEndpoint("ticket_notification_created.worker", e =>
                {
                    e.ConfigureConsumer<TicketNotificationConsumer>(context);
                    e.UseMessageRetry(r => r.Immediate(5));
                });
            });
        });
    }

    private static void AddCorsPolicy(WebApplicationBuilder builder)
    {
        builder.Services.AddCors(options =>
        {
            options.AddPolicy("spa", policy =>
            {
                var origins = builder.Configuration.GetSection("Cors:Policies:spa:Origins").Get<string[]>() ?? [];

                if (origins.Length > 0)
                    policy.WithOrigins(origins);

                policy.AllowAnyHeader()
                      .AllowAnyMethod()
                      .AllowCredentials();
            });
        });
    }

    private static void UseSerilog(WebApplicationBuilder builder)
    {
        builder.Host.UseSerilog((context, services, loggerConfiguration) =>
        {
            loggerConfiguration
                .ReadFrom.Configuration(context.Configuration)
                .ReadFrom.Services(services)
                .Enrich.FromLogContext()
                .WriteTo.Console();

            var seqUrl = context.Configuration["Serilog:SeqUrl"];
            if (!string.IsNullOrWhiteSpace(seqUrl))
                loggerConfiguration.WriteTo.Seq(seqUrl);
        });
    }
}