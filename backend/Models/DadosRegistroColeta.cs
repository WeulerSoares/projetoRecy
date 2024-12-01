namespace AppReciclagem.Models
{
    public class DadosRegistroColeta
    {
        public DadosRegistroColeta(
            int idRegistroColeta,
            string nomePontoColeta,
            string cpfCliente,
            string tipoMaterial,
            string tipoMedida,
            double total,
            double peso,
            DateTime dataColeta)
        {
            this.IdRegistroColeta = idRegistroColeta;
            this.NomePontoColeta = nomePontoColeta;
            this.CpfCliente = this.FormatarCpf(cpfCliente);
            this.TipoMaterial = tipoMaterial;
            this.TipoMedida = tipoMedida;
            this.Total = total;
            this.Peso = peso;
            this.DataColeta = dataColeta;
        }

        public int IdRegistroColeta { get; set; }

        public string NomePontoColeta { get; set; }

        public string CpfCliente { get; set; }

        public string TipoMaterial { get; set; }

        public string TipoMedida { get; set; }

        public double Total { get; set; }

        public double Peso { get; set; }

        public DateTime DataColeta { get; set; }

        private string FormatarCpf(string cpf)
        {
            if (cpf.Length == 11)
            {
                return Convert.ToUInt64(cpf).ToString(@"000\.000\.000\-00");
            }

            return cpf;
        }
    }
}
