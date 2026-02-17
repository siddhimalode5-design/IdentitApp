using IdentityApp.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using IdentityApp.Modules.Trading.Models;

namespace IdentityApp.Data
{
    public class Context : IdentityDbContext<User>
    {
        public Context(DbContextOptions<Context> options) : base(options) { }

        public DbSet<EmailVerification> EmailVerifications { get; set; }


        public DbSet<Candle> Candles { get; set; } = null!;
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Candle>(entity =>
            {
                entity.Property(e => e.OpenPrice)
                      .HasPrecision(18, 4);

                entity.Property(e => e.HighPrice)
                      .HasPrecision(18, 4);

                entity.Property(e => e.LowPrice)
                      .HasPrecision(18, 4);

                entity.Property(e => e.ClosePrice)
                      .HasPrecision(18, 4);
            });
        }


    }
}
