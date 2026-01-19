namespace Helply.MessagingContracts;

public class TicketCommentAdded
{
    public Guid TicketId { get; set; }
    public DateTime AddedAt { get; set; }
    public Guid UserId { get; set; }
}