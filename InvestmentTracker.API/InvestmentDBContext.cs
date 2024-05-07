using Microsoft.EntityFrameworkCore;

namespace InvestmentTracker.API
{
    public class InvestmentDBContext : DbContext
    {
        public InvestmentDBContext(DbContextOptions<InvestmentDBContext> options) : base(options)
        {
        }

        public DbSet<Investment.Investment> Investments { get; set; }
    }
}
