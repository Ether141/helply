using System.ComponentModel.DataAnnotations;

namespace Helply.Models.Dto.Auth;

public class RegisterRequest
{
    [Required]
    [EmailAddress]
    [MaxLength(256)]
    public string Email { get; set; } = null!;

    [Required]
    [MinLength(2)]
    [MaxLength(64)]
    public string FirstName { get; set; } = null!;

    [Required]
    [MinLength(2)]
    [MaxLength(64)]
    public string LastName { get; set; } = null!;

    [Required]
    [MinLength(8)]
    [MaxLength(128)]
    public string Password { get; set; } = null!;
}
