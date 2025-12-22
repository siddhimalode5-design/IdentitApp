using IdentityApp.DTOs.Account;
using IdentityApp.Models;
using IdentityApp.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Data;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace IdentityApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly JWTService _jwtService;
        private readonly SignInManager<User> _signInManager;
        private readonly UserManager<User> _userManager;
        private readonly EmailService _emailService;
        private readonly IConfiguration _config;

        public AccountController(
            JWTService jwtService,
            SignInManager<User> signInManager,
            UserManager<User> userManager,
            EmailService emailService,
            IConfiguration config)
        {
            _jwtService = jwtService;
            _signInManager = signInManager;
            _userManager = userManager;
            _emailService = emailService;
            _config = config;
        }

        // ======================================================
        // REFRESH TOKEN (GET USER INFO)
        // ======================================================
        [Authorize]
        [HttpGet("refresh-user-token")]
        public async Task<ActionResult<UserDto>> RefreshUserToken()
        {
            var email = User.FindFirst(ClaimTypes.Email)?.Value;

            if (email == null)
                return Unauthorized("Invalid token");

            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
                return Unauthorized("User not found");

            return await  CreateApplicationUserDto(user);

        }

        // ======================================================
         // ======================================================
        // LOGIN
        // ======================================================
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _userManager.FindByNameAsync(model.UserName);
            if (user == null)
                return Unauthorized("Invalid username or password");

            if (!user.EmailConfirmed)
                return Unauthorized("Please confirm your email.");

            var result = await _signInManager.CheckPasswordSignInAsync(user, model.Password, false);

            if (!result.Succeeded)
                return Unauthorized("Invalid username or password");

            return await CreateApplicationUserDto(user);
        }


        // ======================================================
        // REGISTER
        // ======================================================
        [HttpPost("register")]
        public async Task<ActionResult> Register(RegisterDto model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (await CheckEmailExistsAsync(model.Email))
                return BadRequest(new { message = "An account with this email already exists. Try logging in." });

            var userToAdd = new User
            {
                FirstName = model.FirstName.ToLower(),
                LastName = model.LastName.ToLower(),
                UserName = model.Email.ToLower(),
                Email = model.Email.ToLower(),
            };

            var result = await _userManager.CreateAsync(userToAdd, model.Password);
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            // 👇 ADD THIS
            await _userManager.AddToRoleAsync(userToAdd, "User");


            try
            {
                if (await SendConfirmEmailAsync(userToAdd))
                {
                    return Ok(new
                    {
                        title = "Account Created",
                        message = "Verification email sent. Please check your inbox."
                    });
                }

                return BadRequest("Failed to send email. Please contact admin.");
            }
            catch (Exception ex)
            {
                Console.WriteLine("EMAIL ERROR: " + ex.ToString());
                return BadRequest("Email error: " + ex.Message);
            }

        }

        [HttpGet("confirm-email")]
        public async Task<IActionResult> ConfirmEmail(
      [FromQuery] string token,
      [FromQuery] string email)
        {
            var frontendUrl = _config["JWT:ClientUrl"]; // https://localhost:4200

            Console.WriteLine("===== CONFIRM EMAIL =====");
            Console.WriteLine("Email: " + email);
            Console.WriteLine("Encoded Token: " + token);

            if (string.IsNullOrEmpty(token) || string.IsNullOrEmpty(email))
                return Redirect($"{frontendUrl}/email-verification-failed");

            var user = await _userManager.FindByEmailAsync(email.ToLower());
            if (user == null)
                return Redirect($"{frontendUrl}/email-verification-failed");

            if (user.EmailConfirmed)
                return Redirect($"{frontendUrl}/email-verified");

            try
            {
                var decodedToken = Encoding.UTF8.GetString(
                    WebEncoders.Base64UrlDecode(token)
                );

                var result = await _userManager.ConfirmEmailAsync(user, decodedToken);

                if (result.Succeeded)
                    return Redirect($"{frontendUrl}/email-verified");

                return Redirect($"{frontendUrl}/email-verification-failed");
            }
            catch
            {
                return Redirect($"{frontendUrl}/email-verification-failed");
            }
        }




        [HttpPost("resend-email-confirmation-link/{email}")]
        public async Task<ActionResult> ResendEMailConfirmationLink(string email)
        {
            if (string.IsNullOrEmpty(email)) return BadRequest("Invalid email");
            var user = await _userManager.FindByEmailAsync(email);

            if (user == null) return Unauthorized("This email adress has not been registered yet");
            if (user.EmailConfirmed == true) return BadRequest("Your email address was confirmed before. Please login to you account");

            try
            {
                if (await SendConfirmEmailAsync(user))
                {
                    return Ok(new JsonResult(new { title = "Confirmation link sent", message = "Please confirm your email address" }));
                }
                return BadRequest("Failed to send email. Please contact admin");
            }
            catch (Exception)
            {
                return BadRequest("Failed to send email. Please contact admin");
            }
        }
        [HttpPost("forgot-password/{email}")]
        public async Task<ActionResult> ForgotPassword(string email)
        {
            if (string.IsNullOrEmpty(email)) return BadRequest("Invalid email");
            var user = await _userManager.FindByEmailAsync(email);

            if (user == null) return Unauthorized("This email adress has not been registered yet");
            if (user.EmailConfirmed == false) return BadRequest("Please confirm your email address first.");

            try
            {
                if (await SendForgotPasswordEmail(user))
                {
                    return Ok(new JsonResult(new { title = "Forgot  password email sent", message = "Please check your email" }));
                }
                return BadRequest("Failed to send email. Please contact admin");
            }
            catch (Exception)
            {
                return BadRequest("Failed to send email. Please contact admin");
            }

        }

        [HttpPost("reset-password")]
        public async Task<ActionResult> ResetPassword(ResetPasswordDto model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
                return Unauthorized("Invalid request");

            var decodedTokenBytes = WebEncoders.Base64UrlDecode(model.Token);
            var decodedToken = Encoding.UTF8.GetString(decodedTokenBytes);

            var result = await _userManager.ResetPasswordAsync(user, decodedToken, model.Password);

            if (!result.Succeeded)
                return BadRequest(result.Errors);

            return Ok(new { message = "Password reset successful" });
        }

        [HttpPost("make-admin/{email}")]
        public async Task<IActionResult> MakeAdmin(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null) return NotFound("User not found");

            await _userManager.AddToRoleAsync(user, "Admin");
            return Ok("User is now Admin");
        }



        // ======================================================
        // VERIFY EMAIL
        // ======================================================
        //[HttpGet("verify-email")]
        //public async Task<IActionResult> VerifyEmail([FromQuery] string token, [FromQuery] string email)
        //{
        //    var frontendUrl = _config["Frontend:Url"] ?? "http://localhost:4200";

        //    if (string.IsNullOrEmpty(token) || string.IsNullOrEmpty(email))
        //        return Redirect($"{frontendUrl}/email-verification-failed");

        //    var user = await _userManager.FindByEmailAsync(email);
        //    if (user == null)
        //        return Redirect($"{frontendUrl}/email-verification-failed");

        //    var decodedBytes = WebEncoders.Base64UrlDecode(token);
        //    var normalToken = Encoding.UTF8.GetString(decodedBytes);

        //    var result = await _userManager.ConfirmEmailAsync(user, normalToken);

        //    if (result.Succeeded)
        //        return Redirect($"{frontendUrl}/email-verified");

        //    return Redirect($"{frontendUrl}/email-verification-failed");
        //}

        // ======================================================
        // PRIVATE HELPERS
        // ======================================================
        private async Task<ActionResult> CreateApplicationUserDto(User user)
        {
            var jwt = await _jwtService.CreateJWT(user, _userManager);
            var roles = await _userManager.GetRolesAsync(user);

            return Ok(new
            {
                token = jwt,
                user = new
                {
                    email = user.Email,
                    roles = roles
                }
            });
        }



        private async Task<bool> CheckEmailExistsAsync(string email)
        {
            return await _userManager.Users.AnyAsync(x => x.Email == email.ToLower());
        }

        private async Task<bool> SendConfirmEmailAsync(User user)
        {
            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);

            var encodedToken = WebEncoders.Base64UrlEncode(
                Encoding.UTF8.GetBytes(token)
            );

            var confirmUrl =
                $"https://localhost:7008/api/account/confirm-email" +
                $"?token={encodedToken}&email={user.Email}";

            var body = $@"
        <p>Hello {user.FirstName},</p>
        <p>Please confirm your email by clicking the link below:</p>
        <p><a href='{confirmUrl}'>Confirm Email</a></p>
        <p>Thank you</p>";

            var emailSend = new EmailSendDto(
                user.Email,
                "Confirm your email",
                body
            );

            return await _emailService.SendEmailAsync(emailSend);
        }




        private async Task<bool> SendForgotPasswordEmail(User user)
        {
            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            token = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));
            var url = $"{_config["JWT:ClientUrl"]}/{_config["Email:ResetPasswordPath"]}?token={token}&email={user.Email}";

            var body = $"<p>Hello:{user.FirstName}{user.LastName}</p>" +
                $"<p> Username:{user.UserName}.</p>" +
                "<p>In order to reset your password, please click on the following link.</p>" +
                $"<p><a href=\"{url}\">Click here</a></p>" +
                "<p> Thank You,</p>" +
                $"<br>{_config["Email:ApplicationName"]}";

            var emailSend = new EmailSendDto(user.Email, "Forgot password", body);

            return await _emailService.SendEmailAsync(emailSend);

        }
    }
}
