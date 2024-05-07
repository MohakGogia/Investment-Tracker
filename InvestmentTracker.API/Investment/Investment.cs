using InvestmentTracker.API.Core;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InvestmentTracker.API.Investment
{
    [Table("Investments")]
    public class Investment
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Required]
        public int Id { get; set; }
        public DateTimeOffset CreatedOn { get; set; }
        public DateTimeOffset ModifiedOn { get; set; }
        public decimal Amount { get; set; }
        public InvestmentType Type { get; set; }
        public DateTime PurchasedDate { get; set; }
        public DateTime? SellDate { get; set; }
        public int Duration {
            get
            {
                if (SellDate.HasValue)
                {
                    return (SellDate.Value - PurchasedDate).Days;
                }
                else
                {
                    return (DateTime.UtcNow - PurchasedDate).Days;
                }
            }
        } // Holding time
        public string? Description { get; set; }
        public InvestmentStatus Status { get; set; }
    }
}
