using IdentityApp.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace IdentityApp.Data
{
    public class Context:IdentityDbContext<User>
    {

        public Context(DbContextOptions<Context>options):base(options) 
        {

        }
    }
}
