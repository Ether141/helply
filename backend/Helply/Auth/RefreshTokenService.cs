using Helply.Models.Db;
using Microsoft.Extensions.Options;
using System.Security.Cryptography;
using System.Text;

namespace Helply.Auth;

public class RefreshTokenService : IRefreshTokenService
{
    private readonly JwtOptions _options;

    public RefreshTokenService(IOptions<JwtOptions> options)
    {
        _options = options.Value;
    }

    public (RefreshToken Entity, string RawToken) CreateRefreshToken(User user)
    {
        var rawToken = GenerateSecureRandomToken();
        var tokenHash = HashToken(rawToken);

        var entity = new RefreshToken
        {
            TokenHash = tokenHash,
            UserId = user.Id,
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.AddDays(_options.RefreshTokenExpiresDays)
        };

        return (entity, rawToken);
    }

    public string HashToken(string rawToken)
    {
        var bytes = Encoding.UTF8.GetBytes(rawToken);
        var hashBytes = SHA256.HashData(bytes);
        return Convert.ToBase64String(hashBytes);
    }

    private static string GenerateSecureRandomToken()
    {
        var bytes = new byte[64];
        RandomNumberGenerator.Fill(bytes);
        return Convert.ToBase64String(bytes);
    }
}