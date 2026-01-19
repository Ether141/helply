using System.ComponentModel.DataAnnotations;

namespace Helply.Models.Dto.Tickets;

public class AddCommentRequest
{
    [Required]
    [MaxLength(4000)]
    public string Content { get; set; } = null!;
}
