using InvestmentTracker.API.Core;
using Microsoft.AspNetCore.Mvc;

namespace InvestmentTracker.API.Investment
{
    [ApiController]
    [Route("api/[controller]")]
    public class InvestmentController : ControllerBase
    {
        private readonly IInvestmentService _service;

        public InvestmentController(IInvestmentService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<InvestmentDTO>>> GetInvestments([FromQuery] DateTime? fromDate = null, [FromQuery] DateTime? toDate = null)
        {
            var investments = await _service.GetInvestmentsAsync(fromDate, toDate);
            return Ok(investments);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<InvestmentDTO>> GetInvestment(int id)
        {
            var investment = await _service.GetInvestmentByIdAsync(id);
            if (investment == null)
            {
                return NotFound();
            }
            return Ok(investment);
        }

        [HttpPost("search")]
        public async Task<ActionResult<IEnumerable<InvestmentDTO>>> SearchInvestments([FromBody] FilterParameter filterParameter, 
            DateTime fromDate, DateTime toDate)
        {
            return Ok(await _service.SearchInvestments(filterParameter, fromDate, toDate));
        }


        [HttpPost]
        public async Task<ActionResult> AddInvestment(InvestmentDTO investment)
        {
            await _service.AddInvestmentAsync(investment);
            return CreatedAtAction(nameof(GetInvestment), new { id = investment.Id }, investment);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateInvestment(int id, InvestmentDTO investment)
        {
            if (id != investment.Id)
            {
                return BadRequest();
            }

            try
            {
                await _service.UpdateInvestmentAsync(investment);
            }
            catch (Exception)
            {
                return NotFound();
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteInvestment(int id)
        {
            await _service.DeleteInvestmentAsync(id);
            return NoContent();
        }
    }

}
