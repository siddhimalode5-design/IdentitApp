using IdentityApp.Modules.Trading.DTOs;
using IdentityApp.Modules.Trading.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using static System.Net.Mime.MediaTypeNames;

namespace IdentityApp.Modules.Trading.Controllers
{
    [Authorize(Roles = "Admin")]
    [ApiController]
    [Route("api/trading")]


    public class TradingController : ControllerBase
    {
        private readonly IStockOhlcService _stockOhlcService;

        public TradingController(IStockOhlcService stockOhlcService)
        {
            _stockOhlcService = stockOhlcService;

        }

        // ✅ This is your frontend page API
        [HttpGet("stocks/ohlc")]
        public async Task<IActionResult> GetAllStockOhlc()
        {
            var data = await _stockOhlcService.GetAllOhlcAsync();
            return Ok(data);
        }

        [HttpGet("ohlc/filter")]
        public async Task<IActionResult> GetFilteredOhlc(
    [FromQuery] string? symbol,
    [FromQuery] DateTime? fromDate,
    [FromQuery] DateTime? toDate,
    [FromQuery] int pageNumber = 1,
    [FromQuery] int pageSize = 20)
        {
            if (toDate.HasValue && toDate.Value > DateTime.UtcNow)
                return BadRequest("Future date not allowed");

            var result = await _stockOhlcService
                .GetFilteredOhlc(symbol, fromDate, toDate, pageNumber, pageSize);

            return Ok(result);
        }



        [HttpPost("ohlc")]
        public async Task<IActionResult> SaveOhlc([FromBody] List<StockOhlcDto> candles)
        {
            await _stockOhlcService.SaveAsync(candles);
            return Ok("OHLC data saved");
        }
 
    }

}
