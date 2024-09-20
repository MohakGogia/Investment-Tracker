using InvestmentTracker.API.Core;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InvestmentTracker.API
{
    [ApiController]
    [Route("api/[controller]")]
    public class DemoController : ControllerBase
    {
        private readonly InvestmentDBContext _context;

        public DemoController(InvestmentDBContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Resets the investment data by deleting all records.
        /// </summary>
        /// <returns>Returns a status indicating the result of the reset operation.</returns>
        [HttpPost("Reset")]
        public async Task<ActionResult> ResetData()
        {
            _context.Investments.RemoveRange(_context.Investments);
            await _context.SaveChangesAsync();

            await _context.Database.ExecuteSqlRawAsync("DBCC CHECKIDENT ('Investments', RESEED, 0)");

            return Ok();
        }

        /// <summary>
        /// Seeds the investment data with a specified number of random records.
        /// </summary>
        /// <param name="count">The number of records to seed. Defaults to 50.</param>
        /// <returns>Returns a status indicating the result of the seeding operation.</returns>
        [HttpPost("Seed")]
        public async Task<ActionResult> SeedData(int count = 50)
        {
            var random = new Random();
            var investments = Enumerable.Range(1, count).Select(i => new Investment.Investment
            {
                CreatedOn = DateTimeOffset.UtcNow,
                ModifiedOn = DateTimeOffset.UtcNow,
                Amount = random.Next(100, 10000),
                Type = (InvestmentType)random.Next(0, 9),
                PurchasedDate = DateTime.UtcNow.AddDays(-random.Next(1, 365)),
                SellDate = random.Next(0, 2) == 1 ? DateTime.UtcNow : null,
                Description = LoremNET.Lorem.Words(5),
                Status = (InvestmentStatus)random.Next(0, 3)
            });

            _context.Investments.AddRange(investments);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}
