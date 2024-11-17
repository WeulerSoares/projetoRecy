namespace AppReciclagem.Models
{
    public interface ICupomRepository
    {
        IEnumerable<Cupom> GetAllActive();

        void Add(Cupom cupom);
    }
}
