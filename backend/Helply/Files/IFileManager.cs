namespace Helply.Files;

public interface IFileManager
{
    Task<string?> SaveFileAsync(Stream fileStream, string fileName, string? folder = null);
    Task<Stream?> GetFileAsync(string relativePath);
    Task DeleteFileAsync(string relativePath);
}
