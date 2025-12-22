using IdentityApp.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication.Facebook;
using IdentityApp.Models;
 

namespace IdentityApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly JWTService _jwtService;

        public AuthController(UserManager<User> userManager, JWTService jwtService)
        {
            _userManager = userManager;
            _jwtService = jwtService;
        }

        [HttpGet("google")]
        public IActionResult Google()
        {
            return Challenge(new AuthenticationProperties
            {
                RedirectUri = "https://localhost:7008/api/auth/callback"
            }, GoogleDefaults.AuthenticationScheme);
        }

        [HttpGet("facebook")]
        public IActionResult Facebook()
        {
            var properties = new AuthenticationProperties
            {
                RedirectUri = Url.Action("Callback", "Auth")
            };

            return Challenge(properties, FacebookDefaults.AuthenticationScheme);
        }


         

        [HttpGet("callback")]
        public async Task<IActionResult> Callback()
        {
            var result = await HttpContext.AuthenticateAsync(
                CookieAuthenticationDefaults.AuthenticationScheme);

            if (!result.Succeeded)
                return Unauthorized("External authentication failed");

            var provider = result.Properties.Items[".AuthScheme"];
            var providerKey = result.Principal.FindFirstValue(ClaimTypes.NameIdentifier);

            var email =
                result.Principal.FindFirstValue(ClaimTypes.Email)
                ?? result.Principal.FindFirstValue("email");

            if (string.IsNullOrWhiteSpace(email))
            {
                email = $"{provider}_{providerKey}@social.local";
            }


            var name =
                result.Principal.FindFirstValue(ClaimTypes.Name)
                ?? "Social User";

            var user = await _userManager.FindByEmailAsync(email);

            if (user == null)
            {
                user = new User
                {
                    UserName = $"{provider}_{providerKey}",
                    Email = email,
                    FirstName = name,
                    LastName = "Social",          // ✅ ADD THIS LINE
                    EmailConfirmed = true
                };

                var createResult = await _userManager.CreateAsync(user);
                if (!createResult.Succeeded)
                    return BadRequest(createResult.Errors);
            }

            var jwt = await _jwtService.CreateJWT(user, _userManager);
            var roles = await _userManager.GetRolesAsync(user);

            return Redirect(
                $"https://localhost:4200/social-callback" +
                $"?token={jwt}" +
                $"&email={user.Email}" +
                $"&firstName={user.FirstName}" +
                $"&lastName={user.LastName}" +
                $"&roles={string.Join(",", roles)}"
            );

        }

    }
}


 

 

