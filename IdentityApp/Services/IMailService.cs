using IdentityApp.DTOs.Account;
using System.Threading.Tasks;

namespace IdentityApp.Services
{
    public interface IMailService
    {
        Task<bool> SendEmailAsync(EmailSendDto emailSend);
    }
}
