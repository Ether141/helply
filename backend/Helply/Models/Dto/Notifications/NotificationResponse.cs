namespace Helply.Models.Dto.Notifications;

public class NotificationResponse
{
    public Guid NotificationId { get; set; }
    public Guid TicketId { get; set; }
    public int TicketSlug { get; set; }
    public string Message { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
