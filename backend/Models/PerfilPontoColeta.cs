namespace AppReciclagem.Models
{
    public class PerfilPontoColeta
    {
        public PerfilPontoColeta(
            int idPontoColeta,
            string nomePontoColeta,
            bool favoritado,
            decimal? avaliacao,
            IEnumerable<MaterialColeta> materiais,
            string descricao)
        {
            IdPontoColeta = idPontoColeta;
            NomePontoColeta = nomePontoColeta;
            Favoritado = favoritado;
            Avaliacao = avaliacao;
            Materiais = materiais;
            Descricao = descricao;
        }

        public int IdPontoColeta { get; set; }

        public string NomePontoColeta { get; set; }

        public bool Favoritado { get; set; }

        public decimal? Avaliacao { get; set; }

        public IEnumerable<MaterialColeta> Materiais { get; set; }

        public string Descricao { get; set; }
    }
}
