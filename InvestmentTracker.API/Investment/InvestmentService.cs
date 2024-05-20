using AutoMapper;
using InvestmentTracker.API.Core;

namespace InvestmentTracker.API.Investment
{
    public interface IInvestmentService
    {
        Task<IEnumerable<InvestmentDTO>> GetInvestmentsAsync(DateTime? fromDate = null, DateTime? toDate = null);
        Task<IEnumerable<InvestmentDTO>> SearchInvestments(FilterParameter filterParameter, DateTime fromDate, DateTime toDate);
        Task<InvestmentDTO> GetInvestmentByIdAsync(int id);
        Task AddInvestmentAsync(InvestmentDTO investment);
        Task UpdateInvestmentAsync(InvestmentDTO investment);
        Task DeleteInvestmentAsync(int id);
    }

    public class InvestmentService : IInvestmentService
    {
        private readonly IInvestmentRepository _repository;
        private readonly IMapper _mapper;

        public InvestmentService(IInvestmentRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<InvestmentDTO>> GetInvestmentsAsync(DateTime? fromDate = null, DateTime? toDate = null)
        {
            var investments = await _repository.GetInvestmentsAsync(fromDate, toDate);
            return _mapper.Map<IEnumerable<InvestmentDTO>>(investments);
        }

        public async Task<IEnumerable<InvestmentDTO>> SearchInvestments(FilterParameter filterParameter, DateTime fromDate, DateTime toDate)
        {
            var pagedData = await _repository.SearchInvestments(filterParameter, fromDate, toDate);
            return _mapper.Map<IEnumerable<InvestmentDTO>>(pagedData);
        }

        public async Task<InvestmentDTO> GetInvestmentByIdAsync(int id)
        {
            var investment = await _repository.GetInvestmentByIdAsync(id);
            return _mapper.Map<InvestmentDTO>(investment);
        }

        public async Task AddInvestmentAsync(InvestmentDTO investment)
        {
            var entity = _mapper.Map<Investment>(investment);
            await _repository.AddInvestmentAsync(entity);
        }

        public async Task UpdateInvestmentAsync(InvestmentDTO investment)
        {
            var entity = _mapper.Map<Investment>(investment);
            await _repository.UpdateInvestmentAsync(entity);
        }

        public async Task DeleteInvestmentAsync(int id)
        {
            await _repository.DeleteInvestmentAsync(id);
        }
    }
}
