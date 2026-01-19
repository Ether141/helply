namespace Helply.Models.Dto.Tickets;

public class TicketCommentResponse
{
    public string Content { get; set; } = null!;
    public string AuthorName { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
    public bool IsOwnerComment { get; set; }
}
