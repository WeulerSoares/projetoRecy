using AppReciclagem.Models;

namespace AppReciclagem.Infraestrutura
{
    public class CupomRepository
        (ConnectionContext context) : ICupomRepository
    {
        public IEnumerable<Cupom> GetAllActive()
        {
            return context.Cupons.Where(f => f.Quantidade > 0);
        }

        public void Add(Cupom cupom)
        {
            context.Cupons.Add(cupom);
            context.SaveChanges();
        }
    }
}
