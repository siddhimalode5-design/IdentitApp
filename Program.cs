using IdentityApp.Data;
using IdentityApp.Models;
using IdentityApp.Services;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Facebook;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
 

using System;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


builder.Services.AddDbContext<Context>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
);

builder.Services.AddScoped<JWTService>();

builder.Services.AddScoped<EmailService>();




builder.Services.AddIdentityCore<User>(options =>
{
    //password configuration
    options.Password.RequiredLength = 6;
    options.Password.RequireDigit = false;
    options.Password.RequireLowercase = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireNonAlphanumeric = false;

    //for email confirmation
    options.SignIn.RequireConfirmedEmail = true;

})

.AddRoles<IdentityRole>()// be able to add roles
.AddRoleManager<RoleManager<IdentityRole>>()// be able to make use of RoleMAnager
.AddEntityFrameworkStores<Context>()// providing our Context
.AddSignInManager<SignInManager<User>>()// make use of Signin manager
.AddUserManager<UserManager<User>>()// make use of UserManager to create users
.AddDefaultTokenProviders();// be able to create tokens for email confirmation


builder.Services.AddAuthentication(options =>
{
    // 🔑 APIs use JWT by default
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;

    // 🔐 External login still uses cookies internally
    options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
})

//.AddCookie(CookieAuthenticationDefaults.AuthenticationScheme) // app cookie

// 🔐 REQUIRED FOR EXTERNAL LOGIN
.AddCookie(options =>
{
    options.Events.OnRedirectToLogin = context =>
    {
        // 🔥 IMPORTANT: Stop redirect for APIs
        if (context.Request.Path.StartsWithSegments("/api"))
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            return Task.CompletedTask;
        }

        context.Response.Redirect(context.RedirectUri);
        return Task.CompletedTask;
    };

    options.Events.OnRedirectToAccessDenied = context =>
    {
        if (context.Request.Path.StartsWithSegments("/api"))
        {
            context.Response.StatusCode = StatusCodes.Status403Forbidden;
            return Task.CompletedTask;
        }

        context.Response.Redirect(context.RedirectUri);
        return Task.CompletedTask;
    };
})


// 🔐 JWT (for API access after login)
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["JWT:Key"])
        ),
        ValidateIssuer = true,
        ValidIssuer = builder.Configuration["JWT:Issuer"],
        ValidateAudience = false,

        // 🔥 REQUIRED FOR [Authorize(Roles = "Admin")]
        RoleClaimType = ClaimTypes.Role,
        NameClaimType = ClaimTypes.Email
    };
})


//// 🍪 Cookie (REQUIRED for OAuth flow)
//.AddCookie(CookieAuthenticationDefaults.AuthenticationScheme, options =>
//{
//    options.Cookie.SameSite = SameSiteMode.None;
//    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
//})


// 🔴 Google
.AddGoogle(options =>
{
    options.ClientId = builder.Configuration["Authentication:Google:ClientId"];
    options.ClientSecret = builder.Configuration["Authentication:Google:ClientSecret"];

    options.SignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    options.CallbackPath = "/signin-google";

    // 🔴 REQUIRED
    options.Scope.Add("email");
    options.Scope.Add("profile");

    options.SaveTokens = true;
})


// 🔵 Facebook
.AddFacebook(options =>
{
    options.AppId = builder.Configuration["Authentication:Facebook:AppId"];
    options.AppSecret = builder.Configuration["Authentication:Facebook:AppSecret"];

    options.SignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;

    // ✅ MUST be this
    options.CallbackPath = "/signin-facebook";


    options.Scope.Add("email");
    options.Fields.Add("email");
    options.Fields.Add("name");
});

 


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular",
        policy =>
        {
            policy.WithOrigins(
                "https://localhost:4200" // local Angular frontend
                                         
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
        });
});

builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.InvalidModelStateResponseFactory = actionContext =>
    {
        var errors = actionContext.ModelState
        .Where(X509EncryptingCredentials => X509EncryptingCredentials.Value.Errors.Count > 0)
        .SelectMany(X509EncryptingCredentials => X509EncryptingCredentials.Value.Errors)
        .Select(X509EncryptingCredentials => X509EncryptingCredentials.ErrorMessage).ToArray();

        var toReturn = new
        {
            Errors = errors
        };

        return new BadRequestObjectResult(toReturn);
    };
});




var app = builder.Build();
if (true)
{
    app.UseDeveloperExceptionPage();
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}



app.UseHttpsRedirection();


app.UseCors("AllowAngular");




app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();
app.Lifetime.ApplicationStarted.Register(async () =>
{
    try
    {
        var apiKey = builder.Configuration["MailJet:ApiKey"];
        var secret = builder.Configuration["MailJet:SecretKey"];

        var client = new Mailjet.Client.MailjetClient(apiKey, secret);

        Console.WriteLine("Testing MailJet...");

        var request = new Mailjet.Client.MailjetRequest
        {
            Resource = Mailjet.Client.Resources.Contact.Resource
        };

        var response = await client.GetAsync(request);

        Console.WriteLine("=== MAILJET RESPONSE START ===");
        Console.WriteLine(response.GetData());
        Console.WriteLine("=== MAILJET RESPONSE END ===");
    }
    catch (Exception ex)
    {
        Console.WriteLine("MailJet Error: " + ex.Message);
    }
});



// 🔐 CREATE ROLES & ADMIN USER
async Task CreateRolesAndAdminUser(IServiceProvider serviceProvider)
{
    var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    var userManager = serviceProvider.GetRequiredService<UserManager<User>>();

    string[] roles = { "Admin", "User" };

    foreach (var role in roles)
    {
        if (!await roleManager.RoleExistsAsync(role))
        {
            await roleManager.CreateAsync(new IdentityRole(role));
        }
    }

    var adminEmail = "siddhimalode5@gmail.com";

    var adminUser = await userManager.FindByEmailAsync(adminEmail);
    if (adminUser != null && !await userManager.IsInRoleAsync(adminUser, "Admin"))
    {
        await userManager.AddToRoleAsync(adminUser, "Admin");
    }
}

// 🔥 EXECUTE IT ON APP START
using (var scope = app.Services.CreateScope())
{
    await CreateRolesAndAdminUser(scope.ServiceProvider);
}



app.Run();