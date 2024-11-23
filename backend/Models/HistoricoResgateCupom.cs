using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppReciclagem.Models
{
    [Table("historico_resgate_cupons")]
    public class HistoricoResgateCupom
    {
        [Key]
        [Column("id_resgate")]
        public int IdResgate { get; set; }

        [Column("id_cupom")]
        public int IdCupom { get; set; }

        [Column("id_usuario")]
        public int IdUsuario { get; set; }

        [Column("data_resgate")]
        public DateTime DataResgate { get; set; }
    }
}
