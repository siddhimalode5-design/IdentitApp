using IdentityApp.DTOs.Account;
using Mailjet.Client;
using Mailjet.Client.TransactionalEmails;
using Microsoft.Extensions.Configuration;
using System;
using System.Threading.Tasks;

namespace IdentityApp.Services
{
    public class EmailService : IMailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task<bool> SendEmailAsync(EmailSendDto emailSend)
        {
            try
            {
                var client = new MailjetClient(
                    _config["MailJet:ApiKey"],
                    _config["MailJet:SecretKey"]
                );

                var email = new TransactionalEmailBuilder()
                    .WithFrom(new SendContact(
                        _config["Email:From"],
                        _config["Email:ApplicationName"]
                    ))
                    .WithSubject(emailSend.Subject)
                    .WithHtmlPart(emailSend.Body)
                    .WithTo(new SendContact(emailSend.To))
                    .Build();

                var response = await client.SendTransactionalEmailAsync(email);

                return response.Messages?[0]?.Status == "success";
            }
            catch
            {
                return false;
            }
        }
    }
}
