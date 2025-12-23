using System.ComponentModel.DataAnnotations;

namespace IdentityApp.DTOs.Account
{
    public class ResetPasswordDto
    {
        [Required]
        public string Email { get; set; }

        [Required]
        public string Token { get; set; }

        [Required]
        [MinLength(8)]
        public string Password { get; set; }
    }
}
