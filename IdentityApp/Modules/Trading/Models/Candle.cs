using System;

namespace IdentityApp.Modules.Trading.Models
{
    public class Candle
    {
        public long Id { get; set; }
        public string TradingSymbol { get; set; }
        public DateTime TimeStamp { get; set; }

        public decimal OpenPrice { get; set; }
        public decimal HighPrice { get; set; }
        public decimal LowPrice { get; set; }
        public decimal ClosePrice { get; set; }

        public long Volume { get; set; }

        
    }

}
