using AppReciclagem.Models;

namespace AppReciclagem.Infraestrutura
{
    public class RegistroColetaRepository(
        ConnectionContext context) : IRegistroColetaRepository
    {
        public void Add(RegistroColeta registroColeta)
        {
            context.RegistroColeta.Add(registroColeta);
            context.SaveChanges();
        }

        public List<RegistroColeta> GetAll(int idPontoColeta)
        {
            return context.RegistroColeta
                .Where(material => material.IdPontoColeta == idPontoColeta)
                .ToList();
        }
    }
}
