using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace IdentityApp.Migrations
{
    /// <inheritdoc />
    public partial class candelmodelupdated : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HollowCandleType",
                table: "Candles");

            migrationBuilder.DropColumn(
                name: "VolumeCandle",
                table: "Candles");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "HollowCandleType",
                table: "Candles",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "VolumeCandle",
                table: "Candles",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
