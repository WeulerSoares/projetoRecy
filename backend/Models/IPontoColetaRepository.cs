namespace AppReciclagem.Models
{
    public interface IPontoColetaRepository
    {
        PontoColeta? Get(int idPontoColeta);

        PerfilPontoColeta ObterPerfilPontoColeta(int id, int idUsuario);

        List<PontoColeta> GetAll();

        List<PontoColeta> GetInRange(
            double range, 
            double latitude, 
            double longitude);

        IEnumerable<PontoColetaPesquisa> ObterPontosColetaNoRange(
            int idUsuario,
            double range,
            double latitude,
            double longitude);

        void Add(PontoColeta pontoColeta);

        void Update(PontoColeta pontoColeta);

        void Delete(int idPontoColeta);

        string ObterCaminhoFoto(int idPontoColeta);
    }
}
