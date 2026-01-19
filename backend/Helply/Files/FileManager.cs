namespace Helply.Files;

public class FileManager : IFileManager
{
    public string FileStoragePath => Path.Combine(_environment.ContentRootPath, "file_storage");

    private readonly IHostEnvironment _environment;
    private readonly ILogger<FileManager> _logger;

    public FileManager(IHostEnvironment environment, ILogger<FileManager> logger)
    {
        _environment = environment;
        _logger = logger;

        EnsureStoragePathExists();
    }

    private void EnsureStoragePathExists()
    {
        if (!Directory.Exists(FileStoragePath))
        {
            Directory.CreateDirectory(FileStoragePath);
            _logger.LogInformation("Created file storage directory at {Path}", FileStoragePath);
        }
    }

    public async Task<string?> SaveFileAsync(Stream fileStream, string fileName, string? folder = null)
    {
        try
        {
            var guid = Guid.NewGuid().ToString();
            fileName = $"{guid}_{fileName}";

            var relativePath = folder != null ? Path.Combine(folder, fileName) : fileName;
            var filePath = Path.Combine(FileStoragePath, relativePath);

            var directory = Path.GetDirectoryName(filePath);

            if (directory != null && !Directory.Exists(directory))
            {
                Directory.CreateDirectory(directory);
                _logger.LogInformation("Created directory {Directory} for file storage", directory);
            }

            using (var fileOutput = new FileStream(filePath, FileMode.Create, FileAccess.Write))
            {
                await fileStream.CopyToAsync(fileOutput);
            }

            _logger.LogInformation("Saved file {FileName} at {Path}", fileName, filePath);
            return relativePath;
        }
        catch (Exception)
        {
            _logger.LogError("Error saving file {FileName}", fileName);
            return null;
        }
    }

    public async Task<Stream?> GetFileAsync(string relativePath)
    {
        try
        {
            var filePath = Path.Combine(FileStoragePath, relativePath);

            if (!File.Exists(filePath))
            {
                return null;
            }

            var memoryStream = new MemoryStream();

            using (var fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read))
            {
                await fileStream.CopyToAsync(memoryStream);
            }

            memoryStream.Position = 0;
            return memoryStream;
        }
        catch (Exception)
        {
            _logger.LogError("Error retrieving file at {Path}", relativePath);
            return null;
        }
    }

    public async Task DeleteFileAsync(string relativePath)
    {
        try
        {
            var filePath = Path.Combine(FileStoragePath, relativePath);

            if (!File.Exists(filePath))
            {
                return;
            }

            File.Delete(filePath);
        }
        catch (Exception) 
        {
            _logger.LogError("Error deleting file at {Path}", relativePath);
        }
    }
}
