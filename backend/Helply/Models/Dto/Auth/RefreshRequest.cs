using System.ComponentModel.DataAnnotations;

namespace Helply.Models.Dto.Auth;

public class RefreshRequest
{
    [Required]
    public string RefreshToken { get; set; } = null!;
}
