﻿namespace InvestmentTracker.API.Core
{
    public enum InvestmentType
    {
        FD = 0,
        PPF = 1,
        MutualFunds = 2,
        Stocks = 3,
        SGB = 4,
        ETF = 5,
        CorporateBonds = 6,
        REIT = 7,
        Crypto = 8,
        IPO = 9
    }

    public enum InvestmentStatus
    {
        Active = 0,
        Sold = 1,
        Matured = 2
    }

    public enum SortOrder
    {
        Ascending = 1,
        Descending = -1,
    }
}
