using Microsoft.EntityFrameworkCore;
using AppReciclagem.Models;

namespace AppReciclagem.Infraestrutura
{
    public class ConnectionContext : DbContext
    {
        public ConnectionContext(DbContextOptions<ConnectionContext> options) : base(options) { }
        
        public DbSet<Usuario> Usuarios { get; set; }

        public DbSet<PontoColeta> PontosColeta { get; set; }

        public DbSet<EmpresaParceira> EmpresasParceira { get; set; }

        public DbSet<Cupom> Cupons { get; set; }

        public DbSet<HistoricoResgateCupom> ResgatesCupons { get; set; }

        public DbSet<MaterialColeta> MaterialColeta { get; set; }

        public DbSet<RegistroColeta> RegistrosColeta { get; set; }

        public DbSet<AvaliacaoPontoColeta> AvaliacoesPontosColeta { get; set; }

        public DbSet<FavoritoPontoColeta> PontosColetaFavoritos { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseMySql(
                "Server=127.0.0.1;Port=3306;Database=app_reciclagem;User=root;Password=Tng@5bmg0XGed1_.ijH?2b£L/;",
                new MySqlServerVersion(new Version(8, 0, 33)));
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<AvaliacaoPontoColeta>()
                .HasKey(apc => new { apc.IdPontoColeta, apc.IdUsuario });

            modelBuilder.Entity<FavoritoPontoColeta>()
                .HasKey(apc => new { apc.IdPontoColeta, apc.IdUsuario });
        }
    }
}
