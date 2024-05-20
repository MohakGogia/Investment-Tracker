using InvestmentTracker.API.Core;
using Microsoft.EntityFrameworkCore;

namespace InvestmentTracker.API.Investment
{
    public interface IInvestmentRepository
    {
        Task<IEnumerable<Investment>> GetInvestmentsAsync(DateTime? fromDate = null, DateTime? toDate = null);
        Task<IEnumerable<Investment>> SearchInvestments(FilterParameter filterParameter, DateTime fromDate, DateTime toDate);
        Task<Investment?> GetInvestmentByIdAsync(int id);
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

        public async Task<IEnumerable<Investment>> GetInvestmentsAsync(DateTime? fromDate = null, DateTime? toDate = null)
        {
            fromDate ??= DateTime.MinValue;
            toDate ??= DateTime.UtcNow;

            return await _context.Investments
                .Where(i => i.PurchasedDate >= fromDate && i.PurchasedDate <= toDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<Investment>> SearchInvestments(FilterParameter filterParameter, DateTime fromDate, DateTime toDate)
        {
            var query = _context.Investments.AsQueryable();
            query = query.Where(i => i.PurchasedDate >= fromDate && i.PurchasedDate <= toDate);

            if (filterParameter.FilterColumn != null && filterParameter.FilterValue != null)
            {
                switch (filterParameter.FilterColumn.ToLower())
                {
                    case "description":
                        query = query.Where(i => i.Description.Contains(filterParameter.FilterValue.ToString()));
                        break;
                    case "amount":
                        if (decimal.TryParse(filterParameter.FilterValue.ToString(), out var amount))
                        {
                            query = query.Where(i => i.Amount == amount);
                        }
                        break;
                    case "investmentType":
                        if (Enum.TryParse(filterParameter.FilterValue.ToString(), true, out InvestmentType type))
                        {
                            query = query.Where(i => i.Type == type);
                        }
                        break;
                    case "purchasedDate":
                        if (DateTime.TryParse(filterParameter.FilterValue.ToString(), out DateTime purchasedDate))
                        {
                            query = query.Where(i => i.PurchasedDate == purchasedDate);
                        }
                        break;
                    case "status":
                        if (Enum.TryParse(filterParameter.FilterValue.ToString(), true, out InvestmentStatus status))
                        {
                            query = query.Where(i => i.Status == status);
                        }
                        break;
                    default:
                        break;
                }
            }

            if (!string.IsNullOrEmpty(filterParameter.SortField))
            {
                switch (filterParameter.SortField.ToLower())
                {
                    case "amount":
                        query = filterParameter.SortOrder == Core.SortOrder.Ascending ? query.OrderBy(i => i.Amount) : query.OrderByDescending(i => i.Amount);
                        break;
                    case "investmentType":
                        query = filterParameter.SortOrder == Core.SortOrder.Ascending ? query.OrderBy(i => i.Type) : query.OrderByDescending(i => i.Type);
                        break;
                    case "purchasedDate":
                        query = filterParameter.SortOrder == Core.SortOrder.Ascending ? query.OrderBy(i => i.PurchasedDate) : query.OrderByDescending(i => i.PurchasedDate);
                        break;
                    case "status":
                        query = filterParameter.SortOrder == Core.SortOrder.Ascending ? query.OrderBy(i => i.Status) : query.OrderByDescending(i => i.Status);
                        break;
                    default:
                        break;
                }
            }

            query = query.Skip((filterParameter.PageNumber - 1) * filterParameter.PageSize).Take(filterParameter.PageSize);

            var investments = await query.ToListAsync();

            return investments;
        }

        public async Task<Investment?> GetInvestmentByIdAsync(int id)
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
