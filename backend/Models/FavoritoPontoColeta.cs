using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppReciclagem.Models
{
    [Table("pontos_coleta_favoritos")]
    public class FavoritoPontoColeta
    {
        public FavoritoPontoColeta(int idPontoColeta, int idUsuario)
        {
            IdPontoColeta = idPontoColeta;
            IdUsuario = idUsuario;
        }

        [Key]
        [Column("id_ponto_coleta")]
        public int IdPontoColeta { get; set; }

        [Key]
        [Column("id_usuario")]
        public int IdUsuario { get; set; }
    }
}
