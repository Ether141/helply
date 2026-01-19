using Helply.MessagingContracts;
using Helply.Worker.Consumers;
using MassTransit;
using Microsoft.Extensions.Options;

namespace Helply.Worker;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = Host.CreateApplicationBuilder(args);

        builder.Services.AddOptions<RabbitMqTransportOptions>().BindConfiguration(nameof(RabbitMqTransportOptions));

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

                cfg.ReceiveEndpoint("ticket_status_changed.worker", e =>
                {
                    e.ConfigureConsumer<TicketStatusChangedConsumer>(context);
                    e.UseMessageRetry(r => r.Immediate(5));
                });

                cfg.ReceiveEndpoint("ticket_comment_added.worker", e =>
                {
                    e.ConfigureConsumer<TicketCommentAddedConsumer>(context);
                    e.UseMessageRetry(r => r.Immediate(5));
                });

                cfg.ReceiveEndpoint("ticket_assigned.worker", e =>
                {
                    e.ConfigureConsumer<TicketAssignedConsumer>(context);
                    e.UseMessageRetry(r => r.Immediate(5));
                });
            });
        });

        builder.Build().Run();
    }
}
