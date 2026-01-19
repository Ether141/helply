namespace Helply.MessagingContracts;

public class TicketNotification
{
    public Guid NotificationId { get; set; }
    public Guid UserId { get; set; }
    public Guid TicketId { get; set; }
    public int Type { get; set; }
}
