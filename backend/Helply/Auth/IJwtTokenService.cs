using Helply.Models.Db;

namespace Helply.Auth;

public interface IJwtTokenService
{
    string GenerateToken(User user);
}
