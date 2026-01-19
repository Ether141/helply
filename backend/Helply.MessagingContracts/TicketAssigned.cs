namespace Helply.MessagingContracts;

public class TicketAssigned
{
    public Guid TicketId { get; set; }
    public Guid UserId { get; set; }
    public DateTime AssignedAt { get; set; }
}
