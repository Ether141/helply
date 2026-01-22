using Helply.Auth;
using Helply.Models.Db;
using Helply.Models.Dto.Auth;
using Helply.Repository;
using Helply.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Helply.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class UserController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IPasswordHasher<User> _passwordHasher;
    private readonly IJwtTokenService _jwtService;
    private readonly IRefreshTokenService _refreshTokenService;
    private readonly ILogger<UserController> _logger;

    public UserController(AppDbContext db, IPasswordHasher<User> passwordHasher, IJwtTokenService jwtService, IRefreshTokenService refreshTokenService, ILogger<UserController> logger)
    {
        _db = db;
        _passwordHasher = passwordHasher;
        _jwtService = jwtService;
        _refreshTokenService = refreshTokenService;
        _logger = logger;
    }

    [Authorize]
    [HttpGet("me")]
    [ProducesResponseType(typeof(UserInfoResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(object), StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<object>> Me()
    {
        var user = await _db.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Id == User.GetUserId());

        if (user == null)
            return Unauthorized(new { message = "User not found" });

        return new UserInfoResponse
        {
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email,
            Role = user.Role.ToString()
        };
    }

    [HttpPost("register")]
    [Consumes("application/json")]
    [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(object), StatusCodes.Status409Conflict)]
    public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterRequest request)
    {
        if (!ModelState.IsValid)
            return ValidationProblem(ModelState);

        var exists = await _db.Users.AsNoTracking().AnyAsync(u => u.Email == request.Email);

        if (exists)
            return Conflict(new { message = "Email already in use" });

        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = request.Email.Trim().ToLowerInvariant(),
            FirstName = request.FirstName.Trim(),
            LastName = request.LastName.Trim(),
            Role = UserRole.User
        };

        user.PasswordHash = _passwordHasher.HashPassword(user, request.Password);

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        var accessToken = _jwtService.GenerateToken(user);
        var (refreshEntity, rawRefresh) = _refreshTokenService.CreateRefreshToken(user);
        _db.RefreshTokens.Add(refreshEntity);
        await _db.SaveChangesAsync();

        return Ok(new AuthResponse { AccessToken = accessToken, RefreshToken = rawRefresh });
    }

    [HttpPost("login")]
    [Consumes("application/json")]
    [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(object), StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request)
    {
        if (!ModelState.IsValid)
            return ValidationProblem(ModelState);

        var normalizedEmail = request.Email.Trim().ToLowerInvariant();
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == normalizedEmail);

        if (user == null)
            return Unauthorized(new { message = "Invalid credentials" });

        var verification = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);

        if (verification == PasswordVerificationResult.Failed)
            return Unauthorized(new { message = "Invalid credentials" });

        var accessToken = _jwtService.GenerateToken(user);
        var (refreshEntity, rawRefresh) = _refreshTokenService.CreateRefreshToken(user);
        _db.RefreshTokens.Add(refreshEntity);

        await _db.SaveChangesAsync();

        return Ok(new AuthResponse { AccessToken = accessToken, RefreshToken = rawRefresh });
    }

    [HttpPost("refresh")]
    [Consumes("application/json")]
    [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(object), StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<AuthResponse>> Refresh([FromBody] RefreshRequest request)
    {
        if (!ModelState.IsValid)
            return ValidationProblem(ModelState);

        var tokenHash = _refreshTokenService.HashToken(request.RefreshToken);
        var entity = await _db.RefreshTokens.FirstOrDefaultAsync(rt => rt.TokenHash == tokenHash);

        if (entity == null || !entity.IsActive)
            return Unauthorized(new { message = "Invalid or expired refresh token" });

        var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == entity.UserId);

        if (user == null)
            return Unauthorized(new { message = "Invalid token user" });

        entity.RevokedAt = DateTime.UtcNow;

        var accessToken = _jwtService.GenerateToken(user);
        var (newRefreshEntity, rawRefresh) = _refreshTokenService.CreateRefreshToken(user);
        _db.RefreshTokens.Add(newRefreshEntity);

        await _db.SaveChangesAsync();

        _logger.LogInformation("Refresh token used for user {UserId}. Old token revoked at {RevokedAt}, new token created with ID {NewTokenId}.", user.Id, entity.RevokedAt, newRefreshEntity.Id);

        return Ok(new AuthResponse { AccessToken = accessToken, RefreshToken = rawRefresh });
    }
}
