namespace AppReciclagem.Models
{
    public interface IPontoColetaRepository
    {
        PontoColeta Get(int idPontoColeta);

        List<PontoColeta> GetAll();

        void Add(PontoColeta pontoColeta);

        void Update(PontoColeta pontoColeta);

        void Delete(int idPontoColeta);
    }
}
