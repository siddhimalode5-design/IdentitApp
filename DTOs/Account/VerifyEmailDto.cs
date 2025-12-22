namespace IdentityApp.DTOs.Account
{
    public class VerifyEmailDto
    {
        public string Email { get; set; }
        public string Token { get; set; }

        // Optional: You may pass password in query by POST body (but we stored the payload server-side so not needed)
    }
}
