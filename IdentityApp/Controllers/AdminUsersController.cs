using IdentityApp.DTOs.Account;
using IdentityApp.Models;
using IdentityApp.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
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

        private readonly IMailService _mailService;
        private readonly IConfiguration _config;


        public AdminUsersController(UserManager<User> userManager, IMailService mailService,
    IConfiguration config)
        {
            _userManager = userManager;
            _mailService = mailService;
            _config = config;
        }

        [HttpGet]
        public IActionResult GetConfirmedUsers(
    [FromQuery] string search = "",
    [FromQuery] int page = 1,
    [FromQuery] int pageSize = 10)
        {
            var query = _userManager.Users
                .Where(u => u.EmailConfirmed && !u.IsDeleted); // ✅ exclude deleted

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
                    IsLocked = u.LockoutEnd != null &&
                               u.LockoutEnd > DateTimeOffset.UtcNow
                })
                .ToList();

            return Ok(new { totalUsers, users });
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

            return Ok(new { message = "User Lock Successfully" });
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

            return Ok(new { message = "User Unlock Successfully" });
        }


        [HttpDelete("{userId}")]
        public async Task<IActionResult> DeleteUser(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return NotFound("User not found");

            var currentUserEmail = User.FindFirstValue(ClaimTypes.Email);
            if (user.Email == currentUserEmail)
                return BadRequest("You cannot delete your own account");

            // ✅ SOFT DELETE
            user.IsDeleted = true;

            // 🔒 also block login permanently
            user.LockoutEnd = DateTimeOffset.UtcNow.AddYears(100);

            await _userManager.UpdateAsync(user);

            return Ok(new
            {
                message = "User permanently deleted"
            });
        }

        [HttpPut("suspend/{userId}")]
        public async Task<IActionResult> SuspendUser(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return NotFound("User not found");

            var currentUserEmail = User.FindFirstValue(ClaimTypes.Email);
            if (user.Email == currentUserEmail)
                return BadRequest("You cannot suspend your own account");

            user.IsDeleted = true; // soft delete
            user.LockoutEnd = DateTimeOffset.UtcNow.AddYears(100);

            await _userManager.UpdateAsync(user);

            return Ok(new { message = "User suspended successfully" });
        }

        [HttpPut("unsuspend/{userId}")]
        public async Task<IActionResult> UnsuspendUser(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return NotFound("User not found");

            user.IsDeleted = false;
            user.LockoutEnd = null;

            await _userManager.UpdateAsync(user);

            return Ok(new { message = "User unsuspended successfully" });
        }


        [HttpPut("{id}/update-basic")]
        public async Task<IActionResult> UpdateUserBasicInfo(
            string id,
            AdminUpdateUserDto dto)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
                return NotFound("User not found");

            // normalize (optional but recommended)
            var firstName = dto.FirstName?.Trim();
            var lastName = dto.LastName?.Trim();

            // allow old → new → old (NO blocking)
            user.FirstName = firstName;
            user.LastName = lastName;

            var result = await _userManager.UpdateAsync(user);

            if (!result.Succeeded)
            {
                return BadRequest(new
                {
                    message = "Failed to update user name",
                    errors = result.Errors.Select(e => e.Description)
                });
            }

            return Ok(new
            {
                message = "User basic details updated successfully"
            });
        }



        [HttpPut("{id}/change-email")]
        public async Task<IActionResult> AdminChangeEmail(
    string id,
    AdminChangeEmailDto dto)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
                return NotFound("User not found");

            if (user.Email == dto.NewEmail)
                return BadRequest("Email is same as current");

            var token = await _userManager.GenerateChangeEmailTokenAsync(
                user,
                dto.NewEmail
            );

            user.EmailConfirmed = false;
            await _userManager.UpdateAsync(user);

            var confirmLink =
    $"{_config["JWT:ClientUrl"]}/verify-email" +
    $"?userId={user.Id}" +
    $"&email={dto.NewEmail}" +
    $"&token={Uri.EscapeDataString(token)}" +
    $"&type=change";



            await _mailService.SendEmailAsync(
    new EmailSendDto(
        dto.NewEmail,
        "Confirm your new email",
        $"Click here to confirm: {confirmLink}"
    )
);


            return Ok(new
            {
                message = "Verification link sent to new email address"
            });

        }

         



    }
}




