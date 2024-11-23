using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppReciclagem.Models
{
    [Table("pontos_coleta")]
    public class PontoColeta
    {
        public PontoColeta(
            int idUsuario,
            string nome,
            string cnpj,
            string cep,
            string rua,
            int numero,
            string bairro,
            string cidade,
            string estado) 
        { 
            this.IdUsuario = idUsuario;
            this.Nome = nome;
            this.Cnpj = cnpj;
            this.Cep = cep;
            this.Rua = rua;
            this.Numero = numero;
            this.Bairro = bairro;
            this.Cidade = cidade;
            this.Estado = estado;
        }

        [Key]
        [Column("id_ponto_coleta")]
        public int Id { get; set; }

        [Column("nome")] 
        public string Nome { get; set; }

        [Column("id_usuario")]
        public int IdUsuario { get; set; }

        [Column("cnpj")]
        public string Cnpj { get; set; }

        [Column("cep")]
        public string Cep { get; set; }

        [Column("rua")]
        public string Rua { get; set; }

        [Column("numero")]
        public int Numero { get; set; }

        [Column("bairro")]
        public string Bairro { get; set; }

        [Column("cidade")]
        public string Cidade { get; set; }

        [Column("estado")]
        public string Estado { get; set; }

        [Column("foto_path")]
        public string? FotoPath { get; set; }
    }
}
