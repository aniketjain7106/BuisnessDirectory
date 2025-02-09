using Microsoft.EntityFrameworkCore;
using DirectoryManagement.Data;
using DirectoryManagement.Models;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// Configure MySQL database connection
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<DirectoryDbContext>(options =>
    options.UseMySQL(connectionString));

// Add CORS policy to allow requests from the Angular frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:4200") // Angular app URL
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Add controllers
builder.Services.AddControllers();

// Add Swagger for API documentation
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Enable CORS
app.UseCors("AllowAngularFrontend");

app.UseAuthorization();

// Map controllers
app.MapControllers();

// Seed initial data (optional)
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<DirectoryDbContext>();

    // Ensure the database is created and migrations are applied
    context.Database.EnsureCreated();

    // Seed initial categories if the table is empty
    if (!context.Categories.Any())
    {
        context.Categories.AddRange(
            new Category { Name = "Restaurant" },
            new Category { Name = "Retail" },
            new Category { Name = "Healthcare" }
        );
        context.SaveChanges();
    }

    // Seed initial businesses if the table is empty
    if (!context.Businesses.Any())
    {
        context.Businesses.AddRange(
            new Business
            {
                Name = "ABC Restaurant",
                Address = "123 Main St",
                City = "Mumbai",
                State = "Maharashtra",
                ZipCode = "400001",
                PhoneNumber = "9123456789",
                Category = "Restaurant",
                Website = "https://abcrestaurant.com",
                Rating = 4.5M
            },
            new Business
            {
                Name = "XYZ Retail",
                Address = "456 Market St",
                City = "Delhi",
                State = "Delhi",
                ZipCode = "110001",
                PhoneNumber = "9112345678",
                Category = "Retail",
                Website = "https://xyzretail.com",
                Rating = 4.0M
            }
        );
        context.SaveChanges();
    }
}

// Run the application
app.Run();