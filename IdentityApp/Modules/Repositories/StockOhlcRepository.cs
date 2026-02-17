using IdentityApp.Data;
using IdentityApp.Modules.Trading.DTOs;
using IdentityApp.Modules.Trading.Interfaces;
using IdentityApp.Modules.Trading.Models;
using Microsoft.EntityFrameworkCore;
using SendGrid.Helpers.Mail;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

#nullable enable

namespace IdentityApp.Modules.Trading.Repositories
{
    public class StockOhlcRepository : IStockOhlcRepository
    {
        private readonly Context _db;

        public StockOhlcRepository(Context db)
        {
            _db = db;
        }

        public async Task<IEnumerable<StockOhlcDto>> GetAllAsync()
        {
            return await _db.Candles
                .AsNoTracking()
                .OrderByDescending(c => c.TimeStamp)
                .Take(500)
                .Select(c => new StockOhlcDto
                {
                    Symbol = c.TradingSymbol,
                    Time = c.TimeStamp,
                    Open = c.OpenPrice,
                    High = c.HighPrice,
                    Low = c.LowPrice,
                    Close = c.ClosePrice,
                    Volume = c.Volume
                })
                .ToListAsync();
        }



        public async Task<StockOhlcDto?> GetBySymbolAndDateAsync(
            string symbol,
            DateTime date)
        {
            var start = date.Date;
            var end = start.AddDays(1);

            return await _db.Candles
                .AsNoTracking()
                .Where(c =>
                    c.TradingSymbol == symbol &&
                    c.TimeStamp >= start &&
                    c.TimeStamp < end
                )

                .OrderByDescending(c => c.TimeStamp)
                .Select(c => new StockOhlcDto
                {
                    Symbol = c.TradingSymbol,
                    Time = c.TimeStamp,
                    Open = c.OpenPrice,
                    High = c.HighPrice,
                    Low = c.LowPrice,
                    Close = c.ClosePrice,
                    Volume = c.Volume
                })
                .FirstOrDefaultAsync();
        }
        public async Task<(List<StockOhlcDto> Data, int TotalCount)> GetFilteredOhlc(
    string? symbol,
    DateTime? fromDate,
    DateTime? toDate,
    int pageNumber = 1,
    int pageSize = 20)
        {
            var query = _db.Candles
                .AsNoTracking()
                .AsQueryable();

            // ✅ SYMBOL FILTER (Contains + Case insensitive)
            if (!string.IsNullOrWhiteSpace(symbol))
            {
                var lowered = symbol.ToLower();
                query = query.Where(x =>
                    x.TradingSymbol.ToLower().Contains(lowered));
            }

            if (fromDate.HasValue || toDate.HasValue)
            {
                var from = fromDate?.Date ?? DateTime.MinValue;
                var to = toDate?.Date ?? DateTime.MaxValue;

                query = query.Where(x =>
                    x.TimeStamp >= from &&
                    x.TimeStamp < to
                );
            }



            // ✅ GET TOTAL COUNT BEFORE PAGINATION
            var totalCount = await query.CountAsync();

            // ✅ APPLY PAGINATION
            var data = await query
                .OrderByDescending(x => x.TimeStamp)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(c => new StockOhlcDto
                {
                    Symbol = c.TradingSymbol,
                    Time = c.TimeStamp,
                    Open = c.OpenPrice,
                    High = c.HighPrice,
                    Low = c.LowPrice,
                    Close = c.ClosePrice,
                    Volume = c.Volume
                })
                .ToListAsync();

            return (data, totalCount);
        }



        public async Task InsertBulkAsync(List<StockOhlcDto> candles)
        {
            var entities = candles.Select(c => new Candle
            {
                TradingSymbol = c.Symbol,
                TimeStamp = c.Time,
                OpenPrice = c.Open,
                HighPrice = c.High,
                LowPrice = c.Low,
                ClosePrice = c.Close,
                Volume = c.Volume
            }).ToList();

            await _db.Candles.AddRangeAsync(entities);
            await _db.SaveChangesAsync();
        }


    }
}
