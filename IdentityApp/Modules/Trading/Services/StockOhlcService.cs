using IdentityApp.Modules.Trading.DTOs;
using IdentityApp.Modules.Trading.Interfaces;
 
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IdentityApp.Modules.Trading.Services
{
    public class StockOhlcService : IStockOhlcService
    {
        private readonly IStockOhlcRepository _repository;

        public StockOhlcService(IStockOhlcRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<StockOhlcDto>> GetAllOhlcAsync()
        {
            return await _repository.GetAllAsync();
        }
        public async Task SaveAsync(List<StockOhlcDto> candles)
        {
            await _repository.InsertBulkAsync(candles);
        }


        public Task<StockOhlcDto> GetNiftySpotAsync()
        {
            throw new NotImplementedException();
        }

        public Task<StockOhlcDto> GetNiftySpotForCurrentDayAsync()
        {
            throw new NotImplementedException();
        }
        public async Task<object> GetFilteredOhlc(
    string? symbol,
    DateTime? fromDate,
    DateTime? toDate,
    int pageNumber = 1,
    int pageSize = 20)
        {
            var result = await _repository.GetFilteredOhlc(
                symbol,
                fromDate,
                toDate,
                pageNumber,
                pageSize);

            return new
            {
                data = result.Data,
                totalCount = result.TotalCount
            };
        }




    }
}
