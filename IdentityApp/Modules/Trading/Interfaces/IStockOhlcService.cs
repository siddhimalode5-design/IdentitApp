using IdentityApp.Modules.Trading.DTOs;
using IdentityApp.Modules.Trading.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IdentityApp.Modules.Trading.Interfaces
{
    public interface IStockOhlcService
    {
        Task<IEnumerable<StockOhlcDto>> GetAllOhlcAsync();
        Task<object> GetFilteredOhlc(
string? symbol,
    DateTime? fromDate,
    DateTime? toDate,
    int pageNumber = 1,
    int pageSize = 20);


        Task<StockOhlcDto> GetNiftySpotAsync();
        Task SaveAsync(List<StockOhlcDto> candles);

        Task<StockOhlcDto> GetNiftySpotForCurrentDayAsync();
    }

}
