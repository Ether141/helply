using Helply.Models.Db;

namespace Helply.Auth;

public interface IRefreshTokenService
{
    (RefreshToken Entity, string RawToken) CreateRefreshToken(User user);
    string HashToken(string rawToken);
}
