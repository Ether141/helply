namespace Helply.MessagingContracts;

public class TicketStatusChanged
{
    public Guid TicketId { get; set; }
    public Guid UserId { get; set; }
    public DateTime ChangedAt { get; set; }
}
