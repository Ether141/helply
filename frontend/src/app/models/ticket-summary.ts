export interface TicketSummary {
  open: number;
  inProgress: number;
  waitingForCustomer: number;
  onHold: number;
  resolved: number;
  closed: number;
}