namespace Helply.Models.Dto.Tickets;

public class TicketSummaryResponse
{
    public int Open { get; set; }
    public int InProgress { get; set; }
    public int WaitingForCustomer { get; set; }
    public int OnHold { get; set; }
    public int Resolved { get; set; }
    public int Closed { get; set; }
}
