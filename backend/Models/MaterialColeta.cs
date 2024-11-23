using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppReciclagem.Models
{
    [Table("material_coleta")]
    public class MaterialColeta
    {
        public MaterialColeta(
            int idPontoColeta,
            string tipoMaterial,
            string medida,
            double preco) 
        {
            this.IdPontoColeta = idPontoColeta;
            this.TipoMaterial = tipoMaterial;
            this.Medida = medida;
            this.Preco = preco;
        }

        [Key]
        [Column("id_material_coleta")]
        public int Id { get; set; }

        [Column("id_ponto_coleta")]
        public int IdPontoColeta { get; set; }

        [Column("tipo_material")]
        public string TipoMaterial { get; set; }

        [Column("medida")]
        public string Medida { get; set; }

        [Column("preco")]
        public double Preco { get; set; }
    }
}
