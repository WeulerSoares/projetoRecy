using Microsoft.EntityFrameworkCore;
using AppReciclagem.Infraestrutura;
using AppReciclagem.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddTransient<IUsuarioRepository, UsuarioRepository>();
builder.Services.AddTransient<IEmpresaParceiraRepository, EmpresaParceiraRepository>();
builder.Services.AddTransient<ICupomRepository, CupomRepository>();
builder.Services.AddTransient<IPontoColetaRepository, PontoColetaRepository>();
builder.Services.AddTransient<IMaterialColetaRepository, MaterialColetaRepository>();
builder.Services.AddTransient<IRegistroColetaRepository, RegistroColetaRepository>();
builder.Services.AddTransient<IFavoritoPontoColetaRepository, FavoritoPontoColetaRepository>();
builder.Services.AddTransient<IAvaliacaoPontoColetaRepository, AvaliacaoPontoColetaRepository>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirFront", policy =>
    {
        policy.WithOrigins("http://localhost:8081") // Substitua pela URL e porta do seu frontend
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

// Adicionando o DbContext com MySQL
builder.Services.AddDbContext<ConnectionContext>(options =>
    options.UseMySql(builder.Configuration.GetConnectionString("DefaultConnection"),
        new MySqlServerVersion(new Version(8, 0, 33))), ServiceLifetime.Scoped);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("PermitirFront");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
