using AutoMapper;
using InvestmentTracker.API.Investment;

namespace InvestmentTracker.API.Core
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Investment.Investment, InvestmentDTO>()
                .ReverseMap();
        }
    }

}
