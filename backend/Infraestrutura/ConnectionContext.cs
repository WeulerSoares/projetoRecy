using Microsoft.EntityFrameworkCore;
using TesteApi.Models;

namespace TesteApi.Infraestrutura
{
    public class ConnectionContext : DbContext
    {
        public ConnectionContext(DbContextOptions<ConnectionContext> options) : base(options) { }
        
        public DbSet<Employee> Employees { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseMySql(
                "Server=127.0.0.1;Port=3306;Database=employee_sample;User=root;Password=Tng@5bmg0XGed1_.ijH?2b£L/;",
                new MySqlServerVersion(new Version(8, 0, 33)));
        }
    }
}
