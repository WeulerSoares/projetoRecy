namespace AppReciclagem.Models
{
    public class PontoColetaPesquisa
    {
        public PontoColetaPesquisa(
            int idPontoColeta,
            string nomePontoColeta,
            bool favoritado,
            decimal? avaliacao,
            string endereco,
            double latitude,
            double longitude)
        {
            IdPontoColeta = idPontoColeta;
            NomePontoColeta = nomePontoColeta;
            Favoritado = favoritado;
            Avaliacao = avaliacao;
            Endereco = endereco;
            Latitude = latitude;
            Longitude = longitude;
        }

        public int IdPontoColeta { get; set; }

        public string NomePontoColeta { get; set; }

        public bool Favoritado { get; set; }

        public decimal? Avaliacao { get; set; }

        public string Endereco { get; set; }

        public double Latitude { get; set; }

        public double Longitude { get; set; }
    }
}
