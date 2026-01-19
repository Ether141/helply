using System.ComponentModel.DataAnnotations;

namespace Helply.Models.Db;

public class TicketCategory
{
    public Guid Id { get; set; }

    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = null!;

    [MaxLength(1000)]
    public string? Description { get; set; }

    public ICollection<Ticket> Tickets { get; set; } = [];
}
