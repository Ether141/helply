using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Helply.Hubs;

[Authorize]
public sealed class NotificationsHub : Hub 
{
    private readonly ILogger<NotificationsHub> _logger;

    public NotificationsHub(ILogger<NotificationsHub> logger)
    {
        _logger = logger;
    }

    public override Task OnConnectedAsync()
    {
        _logger.LogInformation("SignalR connected: connId={ConnId}, userIdentifier={UserIdentifier}, name={Name}",
            Context.ConnectionId,
            Context.UserIdentifier,
            Context.User?.Identity?.Name);

        return base.OnConnectedAsync();
    }

    public override Task OnDisconnectedAsync(Exception? exception)
    {
        _logger.LogInformation("SignalR disconnected: connId={ConnId}, userIdentifier={UserIdentifier}",
            Context.ConnectionId,
            Context.UserIdentifier);

        return base.OnDisconnectedAsync(exception);
    }
}
