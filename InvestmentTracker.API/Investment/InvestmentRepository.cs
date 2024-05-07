using Microsoft.EntityFrameworkCore;

namespace InvestmentTracker.API.Investment
{
    public interface IInvestmentRepository
    {
        Task<IEnumerable<Investment>> GetInvestmentsAsync();
        Task<Investment> GetInvestmentByIdAsync(int id);
        Task AddInvestmentAsync(Investment investment);
        Task UpdateInvestmentAsync(Investment investment);
        Task DeleteInvestmentAsync(int id);
    }

    public class InvestmentRepository : IInvestmentRepository
    {
        private readonly InvestmentDBContext _context;

        public InvestmentRepository(InvestmentDBContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Investment>> GetInvestmentsAsync()
        {
            return await _context.Investments.ToListAsync();
        }

        public async Task<Investment> GetInvestmentByIdAsync(int id)
        {
            return await _context.Investments.FindAsync(id);
        }

        public async Task AddInvestmentAsync(Investment investment)
        {
            _context.Investments.Add(investment);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateInvestmentAsync(Investment investment)
        {
            _context.Entry(investment).State = EntityState.Modified;
            investment.ModifiedOn = DateTime.UtcNow;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteInvestmentAsync(int id)
        {
            var investment = await _context.Investments.FindAsync(id);
            if (investment != null)
            {
                _context.Investments.Remove(investment);
                await _context.SaveChangesAsync();
            }
        }
    }

}
