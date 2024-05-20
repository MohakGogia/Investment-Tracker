namespace InvestmentTracker.API.Core
{
    public class FilterParameter
    {
        public string SortField { get; set; } = "";
        public SortOrder SortOrder { get; set; } = SortOrder.Ascending;
        public string? FilterColumn { get; set; }
        public object? FilterValue { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 20;
    }
}
