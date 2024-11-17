using Microsoft.EntityFrameworkCore;
using AppReciclagem.Models;

namespace AppReciclagem.Infraestrutura
{
    public class ConnectionContext : DbContext
    {
        public ConnectionContext(DbContextOptions<ConnectionContext> options) : base(options) { }
        
        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<PontoColeta> PontoColeta { get; set; }

        public DbSet<EmpresaParceira> EmpresasParceira { get; set; }

        public DbSet<Cupom> Cupons { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseMySql(
                "Server=127.0.0.1;Port=3306;Database=app_reciclagem;User=root;Password=TheWall0.15;",
                new MySqlServerVersion(new Version(8, 0, 33)));
        }
    }
}
