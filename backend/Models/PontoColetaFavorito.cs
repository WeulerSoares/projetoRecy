namespace AppReciclagem.Models
{
    public class PontoColetaFavorito
    {
        public PontoColetaFavorito(
            int idPontoColeta,
            string nomePontoColeta,
            bool favoritado,
            decimal? avaliacao)
        {
            this.IdPontoColeta = idPontoColeta;
            this.NomePontoColeta = nomePontoColeta;
            this.Favoritado = favoritado;
            this.Avaliacao = avaliacao;
        }

        public int IdPontoColeta { get; set; }

        public string NomePontoColeta { get; set; }

        public bool Favoritado { get; set; }

        public decimal? Avaliacao { get; set; }
    }
}
