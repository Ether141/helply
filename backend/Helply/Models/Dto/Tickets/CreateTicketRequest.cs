using Helply.Models.Db;
using System.ComponentModel.DataAnnotations;

namespace Helply.Models.Dto.Tickets;

public class CreateTicketRequest
{
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = null!;

    [Required]
    [MaxLength(4000)]
    public string Description { get; set; } = null!;

    [Required]
    public Guid CategoryId { get; set; }

    [Required]
    public Priority Priority { get; set; } = Priority.Medium;
}
