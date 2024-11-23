using AppReciclagem.Models;

namespace AppReciclagem.Infraestrutura
{
    public class PontoColetaRepository(ConnectionContext context) : IPontoColetaRepository
    {
        public PontoColeta Get(int idUsuario)
        {
            var response = context.PontosColeta.First(item => item.IdUsuario == idUsuario);
            return response;
        }

        public List<PontoColeta> GetAll()
        {
            var response = context.PontosColeta.ToList();
            return response; 
        }

        public void Add(PontoColeta pontoColeta)
        {
            context.PontosColeta.Add(pontoColeta);
            context.SaveChanges();
        }

        public void Delete(int idPontoColeta)
        {
            var pontoColeta = context.PontosColeta.Find(idPontoColeta);

            if (pontoColeta != null)
            {
                context.PontosColeta.Remove(pontoColeta);
                context.SaveChanges();
            }
            else
            {
                throw new Exception($"Não encontrado o material de ID{idPontoColeta}.");
            }
        }

        public void Update(PontoColeta pontoColeta)
        {
            context.PontosColeta.Update(pontoColeta);
            context.SaveChanges();
        }
    }
}
