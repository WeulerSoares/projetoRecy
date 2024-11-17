using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppReciclagem.Models
{
    [Table("empresas_parceira")]
    public class EmpresaParceira
    {
        public EmpresaParceira(
            string cnpj,
            string nome,
            string email,
            string logoPath)
        {
            Cnpj = cnpj;
            Nome = nome;
            Email = email;
            this.DataRegistro = DateTime.Now;
            this.LogoPath = logoPath; 
        }

        [Key]
        [Column("id_empresa")]
        public int IdEmpresa { get; set; }

        [Column("cnpj")]
        public string Cnpj { get; set; }

        [Column("nome")]
        public string Nome { get; set; }

        [Column("email")]
        public string Email { get; set; }

        [Column("data_registro")]
        public DateTime DataRegistro { get; set; }

        [Column("logo_path")]
        public string LogoPath { get; set; }
    }
}
