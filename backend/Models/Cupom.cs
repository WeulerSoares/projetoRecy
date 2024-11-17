using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppReciclagem.Models
{
    [Table("cupons")]
    public class Cupom
    {
        public Cupom(
            int idEmpresa,
            decimal valor,
            int quantidade,
            int pontos)
        {
            IdEmpresa = idEmpresa;
            Valor = valor;
            Quantidade = quantidade;
            Pontos = pontos;
        }

        [Key]
        [Column("id_cupom")]
        public int IdCupom { get; set; }

        [Column("id_empresa")]
        public int IdEmpresa { get; set; }

        [Column("valor")]
        public decimal Valor { get; set; }

        [Column("quantidade")]
        public int Quantidade { get; set; }

        [Column("pontos")]
        public int Pontos { get; set; }
    }
}
