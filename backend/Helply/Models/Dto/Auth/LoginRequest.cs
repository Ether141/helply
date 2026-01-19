using System.ComponentModel.DataAnnotations;

namespace Helply.Models.Dto.Auth;

public class LoginRequest
{
    [Required]
    [EmailAddress]
    [MaxLength(256)]
    public string Email { get; set; } = null!;

    [Required]
    [MaxLength(128)]
    public string Password { get; set; } = null!;
}
