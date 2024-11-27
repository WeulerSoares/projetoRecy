namespace AppReciclagem.Models
{
    public interface IPontoColetaRepository
    {
        PontoColeta Get(int idPontoColeta);

        PerfilPontoColeta ObterPerfilPontoColeta(int id, int idUsuario);

        List<PontoColeta> GetAll();

        void Add(PontoColeta pontoColeta);

        void Update(PontoColeta pontoColeta);

        void Delete(int idPontoColeta);

        string ObterCaminhoFoto(int idPontoColeta);
    }
}
