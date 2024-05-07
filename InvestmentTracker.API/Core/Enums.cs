namespace InvestmentTracker.API.Core
{
    public enum InvestmentType
    {
        FD = 0,
        PPF = 1,
        MutualFunds = 2,
        Stocks = 3,
        SGB = 4,
        ETF = 5,
        CorporateBond = 6,
        REIT = 7,
        Crypto = 8
    }

    public enum InvestmentStatus
    {
        Active = 0,
        Sold = 1,
        Matured = 2
    }
}
