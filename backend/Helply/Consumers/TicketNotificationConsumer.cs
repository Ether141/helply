using Helply.Hubs;
using Helply.MessagingContracts;
using Helply.Models.Db;
using Helply.Repository;
using MassTransit;
using Microsoft.AspNetCore.SignalR;

namespace Helply.Consumers;

public class TicketNotificationConsumer : IConsumer<TicketNotification>
{
    private readonly IHubContext<NotificationsHub> _hubContext;
    private readonly ILogger<TicketNotificationConsumer> _logger;
    private readonly AppDbContext _db;

    public TicketNotificationConsumer(IHubContext<NotificationsHub> hubContext, ILogger<TicketNotificationConsumer> logger, AppDbContext db)
    {
        _hubContext = hubContext;
        _logger = logger;
        _db = db;
    }

    public async Task Consume(ConsumeContext<TicketNotification> context)
    {
        _logger.LogInformation("Received TicketNotification with ID: {NotificationId}", context.Message.NotificationId);

        NotificationType notificationType;

        try
        {
            notificationType = GetNotificationTypeFromInt(context.Message.Type);
        }
        catch (ArgumentOutOfRangeException ex)
        {
            _logger.LogError(ex, "Invalid notification type received: {Type}", context.Message.Type);
            return;
        }

        _db.Notifications.Add(new Notification
        {
            Id = context.Message.NotificationId,
            UserId = context.Message.UserId,
            TicketId = context.Message.TicketId,
            CreatedAt = DateTime.UtcNow,
            Type = notificationType,
            IsRead = false
        });

        await _db.SaveChangesAsync();
        await _hubContext.Clients.User(context.Message.UserId.ToString()).SendAsync("notification");
    }

    private static NotificationType GetNotificationTypeFromInt(int typeInt) => typeInt switch
    {
        0 => NotificationType.TicketStatusChanged,
        1 => NotificationType.NewTicketComment,
        2 => NotificationType.TicketAssigned,
        _ => throw new ArgumentOutOfRangeException(nameof(typeInt), "Invalid notification type integer value")
    };
}
