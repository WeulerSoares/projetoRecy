namespace AppReciclagem.Models
{
    public interface IPontoColetaRepository
    {
        PontoColeta? Get(int idPontoColeta);

        List<PontoColeta> GetAll();

        List<PontoColeta> GetInRange(
            double range, 
            double latitude, 
            double longitude);

        void Add(PontoColeta pontoColeta);

        void Update(PontoColeta pontoColeta);

        void Delete(int idPontoColeta);
    }
}
