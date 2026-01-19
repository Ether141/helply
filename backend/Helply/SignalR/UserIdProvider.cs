using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace Helply.SignalR;

public class UserIdProvider : IUserIdProvider
{
    public string? GetUserId(HubConnectionContext connection)
    => connection.User?.FindFirst("sub")?.Value
       ?? connection.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
}
