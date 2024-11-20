namespace AppReciclagem.Models
{
    public interface ICupomRepository
    {
        IEnumerable<CupomVisualizacao> GetAllActive();

        void Add(Cupom cupom);

        string ResgatarCupom(int idCupom, int idUsuario);
    }
}
