using System.ComponentModel.DataAnnotations;

namespace IdentityApp.DTOs.Account
{
    public class AdminUpdateUserDto
    {
        [Required]
        [MaxLength(50)]
        public string FirstName { get; set; }

        [Required]
        [MaxLength(50)]
        public string LastName { get; set; }
    }
}
