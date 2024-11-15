using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppReciclagem.Models
{
    [Table("usuarios")]
    public class Usuario
    {
        public Usuario(
            string firebaseUid,
            string nome,
            string email,
            DateTime? dataNascimento,
            int pontosAcumulados,
            int tipoUsuario,
            string cpf,
            string cnpj)
        {
            this.FirebaseUid = firebaseUid;
            this.Nome = nome;
            this.Email = email;
            this.DataNascimento = dataNascimento;
            this.PontosAcumulados = pontosAcumulados;
            this.TipoUsuario = tipoUsuario;
            this.Cpf = cpf;
            this.Cnpj = cnpj;
            this.DataRegistro = DateTime.Now;
        }

        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("firebase_uid")]
        public string FirebaseUid { get; set; }

        [Column("nome")]
        public string Nome { get; set; }

        [Column("email")]
        public string Email { get; set; }

        [Column("data_nascimento")]
        public DateTime? DataNascimento { get; set; }

        [Column("pontos_acumulados")]
        public int PontosAcumulados { get; set; }

        [Column("data_registro")]
        public DateTime DataRegistro { get; set; }

        [Column("tipo_usuario")]
        public int TipoUsuario { get; set; }

        [Column("cpf")]
        public string Cpf { get; set; }

        [Column("cnpj")]
        public string Cnpj { get; set; }
    }
}
