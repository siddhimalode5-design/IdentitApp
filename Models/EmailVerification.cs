using System;
using System.ComponentModel.DataAnnotations;

namespace IdentityApp.Models
{
    public class EmailVerification
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Token { get; set; } = string.Empty;

        // JSON payload for the registration info (firstName, lastName, password)
        [Required]
        public string PayloadJson { get; set; } = string.Empty;

        public DateTime ExpiresAt { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
