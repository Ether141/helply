using Helply.MessagingContracts;
using MassTransit;

namespace Helply.Worker.Consumers;

public sealed class TicketAssignedConsumer : IConsumer<TicketAssigned>
{
    private readonly ILogger<TicketAssignedConsumer> _logger;

    public TicketAssignedConsumer(ILogger<TicketAssignedConsumer> logger) => _logger = logger;

    public Task Consume(ConsumeContext<TicketAssigned> context)
    {
        var m = context.Message;

        _logger.LogInformation("ticket_assigned: {TicketId} at {At}", m.TicketId, m.AssignedAt);

        context.Publish(new TicketNotification()
        {
            NotificationId = Guid.NewGuid(),
            UserId = m.UserId,
            TicketId = m.TicketId,
            Type = 2
        }, context.CancellationToken);

        return Task.CompletedTask;
    }
}
