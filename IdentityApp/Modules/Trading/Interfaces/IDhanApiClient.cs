using IdentityApp.Modules.Trading.DTOs;
using System;
using System.Threading.Tasks;

namespace IdentityApp.Modules.Trading.Interfaces
{
    public interface IDhanApiClient
    {
        Task<StockOhlcDto> GetIndexSpotAsync(string indexName);

        Task<StockOhlcDto> GetIndexSpotForDateAsync(string indexName, DateTime date);
    }

}
