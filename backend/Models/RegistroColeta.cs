using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppReciclagem.Models
{
    [Table("registro_coleta")]
    public class RegistroColeta
    {
        public RegistroColeta(
            int idPontoColeta,
            string idFirebaseCliente,
            int idTipoMaterial,
            string cpfCliente,
            double total,
            double peso,
            DateTime dataColeta) 
        {
            this.IdPontoColeta = idPontoColeta;
            this.IdFirebaseCliente = idFirebaseCliente;
            this.IdTipoMaterial = idTipoMaterial;
            this.CpfCliente = cpfCliente;
            this.Total = total;
            this.Peso = peso;
            this.DataColeta = dataColeta;
        }

        [Key]
        [Column("id_registro_coleta")]
        public int IdRegistroColeta { get; set; }

        [Column("id_ponto_coleta")]
        public int IdPontoColeta { get; set; }

        [Column("id_firebase_cliente")]
        public string IdFirebaseCliente { get; set; }

        [Column("id_material_coleta")]
        public int IdTipoMaterial { get; set; }

        [Column("cpf_cliente")]
        public string CpfCliente { get; set; }

        [Column("total")]
        public double Total { get; set; }

        [Column("peso")]
        public double Peso { get; set; }

        [Column("data_coleta")]
        public DateTime DataColeta { get; set; }
    }
}
