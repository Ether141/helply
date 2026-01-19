namespace Helply.Models.Dto.Tickets;

public class CategoryDTO
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
}
