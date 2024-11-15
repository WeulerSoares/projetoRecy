using Microsoft.EntityFrameworkCore;
using AppReciclagem.Models;

namespace AppReciclagem.Infraestrutura
{
    public class ConnectionContext : DbContext
    {
        public ConnectionContext(DbContextOptions<ConnectionContext> options) : base(options) { }
        
        public DbSet<Usuario> Usuarios { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseMySql(
                "Server=127.0.0.1;Port=3306;Database=app_reciclagem;User=root;Password=Tng@5bmg0XGed1_.ijH?2b£L/;",
                new MySqlServerVersion(new Version(8, 0, 33)));
        }
    }
}
