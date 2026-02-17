using IdentityApp.Modules.Trading.DTOs;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IdentityApp.Modules.Trading.Interfaces
{
    public interface IStockOhlcRepository
    {
        Task<IEnumerable<StockOhlcDto>> GetAllAsync();

        Task<StockOhlcDto?> GetBySymbolAndDateAsync(string symbol, DateTime date);
        Task InsertBulkAsync(List<StockOhlcDto> candles);
        Task<(List<StockOhlcDto> Data, int TotalCount)> GetFilteredOhlc(string? symbol,
    DateTime? fromDate,
    DateTime? toDate,
    int pageNumber = 1,
    int pageSize = 20);


    }

}
