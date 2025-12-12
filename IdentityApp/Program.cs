using IdentityApp.Data;
using IdentityApp.Models;
using IdentityApp.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Linq;
using System.Text;

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


// be able to authenticate users using JWT
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            // validate the token based on the key we have provided inside appsettings.development.json JWT:Key
            ValidateIssuerSigningKey = true,
            //the issuer singning key based on JWT:Key
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:Key"])),
            //the issuer which in here is the api project url we are using
            ValidIssuer = builder.Configuration["JWT:Issuer"],
            //validate the issuer (who ever is issuing the JWT)
            ValidateIssuer = true,
            //don't validate audience(angular side)
            ValidateAudience = false
        };

    });

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular",
        policy =>
        {
            policy.WithOrigins(
                "http://localhost:4200" // local Angular frontend
                //"https://lucent-dragon-13b5ff.netlify.app", // Netlify frontend
                //"https://pedodontic-fitfully-isidra.ngrok-free.dev" // your ngrok tunnel
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



app.Run();
