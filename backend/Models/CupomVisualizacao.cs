namespace AppReciclagem.Models
{
    public class CupomVisualizacao
    {
        public CupomVisualizacao(
            int idCupom,
            int idEmpresa,
            string nomeEmpresa,
            int pontos,
            decimal valor)
        {
            this.IdCupom = idCupom;
            this.IdEmpresa = idEmpresa;
            this.NomeEmpresa = nomeEmpresa;
            this.Valor = valor;
            this.Pontos = pontos;
        }

        public int IdCupom { get; set; }
        
        public int IdEmpresa { get; set; }

        public string NomeEmpresa { get; set; }

        public int Pontos { get; set; }

        public decimal Valor { get; set; }
    }
}
