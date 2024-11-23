using AppReciclagem.Models;

namespace AppReciclagem.Infraestrutura
{
    public class PontoColetaRepository(ConnectionContext context) : IPontoColetaRepository
    {
        public PontoColeta Get(int idUsuario)
        {
            var response = context.PontoColeta.First(item => item.IdUsuario == idUsuario);
            return response;
        }

        public List<PontoColeta> GetAll()
        {
            var response = context.PontoColeta.ToList();
            return response; 
        }

        public void Add(PontoColeta pontoColeta)
        {
            context.PontoColeta.Add(pontoColeta);
            context.SaveChanges();
        }

        public void Delete(int idPontoColeta)
        {
            var pontoColeta = context.PontoColeta.Find(idPontoColeta);

            if (pontoColeta != null)
            {
                context.PontoColeta.Remove(pontoColeta);
                context.SaveChanges();
            }
            else
            {
                throw new Exception($"Não encontrado o material de ID{idPontoColeta}.");
            }
        }

        public void Update(PontoColeta pontoColeta)
        {
            context.PontoColeta.Update(pontoColeta);
            context.SaveChanges();
        }
    }
}
