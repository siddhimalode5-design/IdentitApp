using System;
using System.Text.Json.Serialization;

namespace IdentityApp.Modules.Trading.DTOs
{
    public class StockOhlcDto
    {
        public string Symbol { get; set; }
        [JsonPropertyName("date")]
        public DateTime Time { get; set; }

        public decimal Open { get; set; }
        public decimal High { get; set; }
        public decimal Low { get; set; }
        public decimal Close { get; set; }

        public long Volume { get; set; }
    }

}
