using Microsoft.EntityFrameworkCore;
using RenartRing.Data;
using RenartRing.Models;
using RenartRing.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("DefaultPolicy", policyBuilder =>
    {
        policyBuilder.AllowAnyOrigin()
            .AllowAnyMethod()  
            .AllowAnyHeader(); 
    });
});

builder.Services.AddDbContextPool<ApplicationDbContext>(opt => 
    opt.UseNpgsql(builder.Configuration.GetConnectionString("ApplicationDbContext")));

builder.Services.AddScoped<IRingService ,RingService>();
builder.Services.AddHostedService<GoldPriceUpdateWorker>();
builder.Services.AddSingleton<IGoldPriceService, GoldPriceService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var goldApiSettings = builder.Configuration.GetSection("GoldApiSettings");

builder.Services.AddHttpClient("GoldApiClient", client =>
{
    client.BaseAddress = new Uri(goldApiSettings["BaseUrl"]);
    client.DefaultRequestHeaders.Add("x-access-token", goldApiSettings["ApiKey"]);
    client.DefaultRequestHeaders.Add("Accept", "application/json");
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<ApplicationDbContext>();
        context.Database.Migrate();
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while migrating the database.");
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("DefaultPolicy");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();