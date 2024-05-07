using InvestmentTracker.API.Core;

namespace InvestmentTracker.API.Investment
{
    public class InvestmentDTO
    {
        public int Id { get; set; }
        public DateTimeOffset CreatedOn { get; set; }
        public DateTimeOffset ModifiedOn { get; set; }
        public decimal Amount { get; set; }
        public InvestmentType Type { get; set; }
        public DateTime PurchasedDate { get; set; }
        public DateTime? SellDate { get; set; }
        public int Duration { get; set; }
        public string? Description { get; set; }
        public InvestmentStatus Status { get; set; }
    }
}
