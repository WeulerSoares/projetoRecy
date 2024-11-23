using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppReciclagem.Models
{
    [Table("avaliacoes_pontos_coleta")]
    public class AvaliacaoPontoColeta
    {
        public AvaliacaoPontoColeta(
            int idPontoColeta,
            int idUsuario,
            decimal avaliacao)
        {
            IdPontoColeta = idPontoColeta;
            IdUsuario = idUsuario;
            Avaliacao = avaliacao;
        }

        [Key]
        [Column("id_ponto_coleta")]
        public int IdPontoColeta { get; set; }

        [Key]
        [Column("id_usuario")]
        public int IdUsuario { get; set; }

        [Column("avaliacao")]
        [Range(0.0, 5.0)]
        public decimal Avaliacao { get; set; }
    }
}
