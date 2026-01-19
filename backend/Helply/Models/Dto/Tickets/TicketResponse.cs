using Helply.Models.Db;

namespace Helply.Models.Dto.Tickets;

public class TicketResponse
{
    public Guid Id { get; set; }
    public int Slug { get; set; }
    public string Title { get; set; } = null!;
    public string Description { get; set; } = null!;
    public TicketStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public Guid UserId { get; set; }
    public Guid? AssistantId { get; set; }
    public string CategoryName { get; set; } = null!;
    public Priority Priority { get; set; }
    public string AuthorName { get; set; } = null!;
    public string? AssistantName { get; set; }
}
