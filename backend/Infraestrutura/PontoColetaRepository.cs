using AppReciclagem.Models;

namespace AppReciclagem.Infraestrutura
{
    public class PontoColetaRepository(ConnectionContext context) : IPontoColetaRepository
    {
        public void Add(PontoColeta pontoColeta)
        {
            context.PontoColeta.Add(pontoColeta);
            context.SaveChanges();
        }
    }
}
