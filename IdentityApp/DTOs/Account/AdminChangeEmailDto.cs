using System.ComponentModel.DataAnnotations;

namespace IdentityApp.DTOs.Account
{
    public class AdminChangeEmailDto
    {
        [Required]
        [EmailAddress]
        public string NewEmail { get; set; }

    }
}
