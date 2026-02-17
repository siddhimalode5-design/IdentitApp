using IdentityApp.Data;
using IdentityApp.Modules.Trading.DTOs;
using IdentityApp.Modules.Trading.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.NetworkInformation;
using System.Text.Json;
using System.Threading.Tasks;
using static System.Net.Mime.MediaTypeNames;

namespace IdentityApp.Modules.Trading.Controllers
{
    [ApiController]
    [Route("api/trading/sync")]
    public class TradingSyncController : ControllerBase
    {
        private readonly Context _db;
        private readonly IHttpClientFactory _httpClientFactory;
        public TradingSyncController(Context db, IHttpClientFactory httpClientFactory)
        {
            _db = db;
            _httpClientFactory = httpClientFactory;
        }

        [HttpPost("candles")]
        public async Task<IActionResult> SyncCandles([FromBody] List<Candle> candles)
        {
            if (candles == null || candles.Count == 0)
                return BadRequest("No candle data received");

            foreach (var candle in candles)
            {
                // 🔥 FORCE UTC NORMALIZATION
                candle.TimeStamp = DateTime.SpecifyKind(
                    candle.TimeStamp,
                    DateTimeKind.Utc
                );

                bool exists = await _db.Candles.AnyAsync(c =>
                    c.TradingSymbol == candle.TradingSymbol &&
                    c.TimeStamp == candle.TimeStamp
                );

                if (!exists)
                {
                    _db.Candles.Add(candle);
                }
            }


            await _db.SaveChangesAsync();

            return Ok(new
            {
                Message = "Candles synced successfully",
                Count = candles.Count
            });
        }
        [HttpPost("load-ohlc")]
        public async Task<IActionResult> LoadOhlcFromDhan()
        {
            var client = _httpClientFactory.CreateClient();

            var response = await client.GetAsync(
                "https://localhost:5001/api/dhan/get-all-ohlc");

            if (!response.IsSuccessStatusCode)
                return BadRequest("Failed to fetch data from DhanWebApp");

            var json = await response.Content.ReadAsStringAsync();

            var dhanCandles = JsonSerializer.Deserialize<List<StockOhlcDto>>(
    json,
    new JsonSerializerOptions
    {
        PropertyNameCaseInsensitive = true
    });

            foreach (var d in dhanCandles)
            {
                bool exists = _db.Candles.Any(c =>
                    c.TradingSymbol == d.Symbol &&
                    c.TimeStamp == d.Time);

                if (exists) continue;

                _db.Candles.Add(new Candle
                {
                    TradingSymbol = d.Symbol,
                    TimeStamp = d.Time,
                    OpenPrice = d.Open,
                    HighPrice = d.High,
                    LowPrice = d.Low,
                    ClosePrice = d.Close,
                    Volume = d.Volume
                });
            }

            await _db.SaveChangesAsync();

            return Ok("OHLC data synced into IdentityApp");
        }
    }
}
