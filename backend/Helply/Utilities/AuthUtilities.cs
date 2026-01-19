using System.Security.Claims;

namespace Helply.Utilities;

public static class AuthUtilities
{
    public static Guid GetUserId(this ClaimsPrincipal claimsPrincipal) => Guid.Parse(claimsPrincipal.FindFirstValue("sub")!);

    public static string GetRole(this ClaimsPrincipal claimsPrincipal) => claimsPrincipal.FindFirstValue(ClaimTypes.Role)!;
}
