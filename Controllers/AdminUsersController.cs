using IdentityApp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace IdentityApp.Controllers
{
    [Authorize(Roles = "Admin")]
    [Route("api/admin/users")]
    [ApiController]

    public class AdminUsersController : ControllerBase
    {
        private readonly UserManager<User> _userManager;

        public AdminUsersController(UserManager<User> userManager)
        {
            _userManager = userManager;
        }

        [HttpGet]
        public IActionResult GetConfirmedUsers(
    [FromQuery] string search = "",
    [FromQuery] int page = 1,
    [FromQuery] int pageSize = 10)
        {
            var query = _userManager.Users
                .Where(u => u.EmailConfirmed);

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(u =>
                    u.Email.Contains(search) ||
                    u.FirstName.Contains(search) ||
                    u.LastName.Contains(search));
            }

            var totalUsers = query.Count();

            var users = query
                .OrderBy(u => u.Email)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(u => new
                {
                    u.Id,
                    u.FirstName,
                    u.LastName,
                    u.Email,
                    IsLocked = u.LockoutEnd != null && u.LockoutEnd > DateTimeOffset.UtcNow
                })
                .ToList();

            return Ok(new
            {
                totalUsers,
                users
            });
        }



        [HttpPut("lock/{userId}")]
        public async Task<IActionResult> LockUser(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {

                return NotFound("User not found");
            }

            // ✅ ADD THIS SAFETY CHECK
            var currentUserEmail = User.FindFirstValue(ClaimTypes.Email);
            if (user.Email == currentUserEmail)
                return BadRequest("You cannot lock your own account");

            user.LockoutEnd = DateTimeOffset.UtcNow.AddYears(100);

            await _userManager.UpdateAsync(user);

            return Ok("User locked");
        }

        [HttpPut("unlock/{userId}")]
        public async Task<IActionResult> UnlockUser(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return NotFound("User not found");
            // ✅ ADD THIS
            var currentUserEmail = User.FindFirstValue(ClaimTypes.Email);
            if (user.Email == currentUserEmail)
                return BadRequest("You cannot unlock your own account");

            user.LockoutEnd = null;
            await _userManager.UpdateAsync(user);

            return Ok("User unlocked");
        }


        [HttpDelete("{userId}")]
        public async Task<IActionResult> DeleteUser(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return NotFound("User not found");
            // ✅ ADD THIS
            var currentUserEmail = User.FindFirstValue(ClaimTypes.Email);
            if (user.Email == currentUserEmail)
                return BadRequest("You cannot delete your own account");
            await _userManager.DeleteAsync(user);
            return Ok("User deleted");
        }

    }
}


 
 
