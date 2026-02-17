#nullable enable
using System;

namespace IdentityApp.Modules.Trading.DTOs
{
    public class StockFilterDto
    {
        public string? Symbol { get; set; }

        public DateTime? FromDate { get; set; }

        public DateTime? ToDate { get; set; }

        public int PageNumber { get; set; } = 1;

        public int PageSize { get; set; } = 20;
    }
}
