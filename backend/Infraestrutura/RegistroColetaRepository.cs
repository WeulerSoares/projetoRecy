using AppReciclagem.Models;

namespace AppReciclagem.Infraestrutura
{
    public class RegistroColetaRepository(
        ConnectionContext context) : IRegistroColetaRepository
    {
        public void Add(RegistroColeta registroColeta)
        {
            context.RegistrosColeta.Add(registroColeta);
            context.SaveChanges();
        }

        public List<DadosRegistroColeta> GetAll(int idPontoColeta)
        {
            var query =
                from registroColeta in context.RegistrosColeta
                join usuario in context.Usuarios on registroColeta.IdUsuario equals usuario.Id
                join materialColeta in context.MaterialColeta on registroColeta.IdTipoMaterial equals materialColeta.Id
                where registroColeta.IdPontoColeta == idPontoColeta
                select new DadosRegistroColeta(
                    registroColeta.IdRegistroColeta,
                    string.Empty,
                    usuario.Cpf,
                    materialColeta.TipoMaterial,
                    materialColeta.Medida,
                    registroColeta.Total,
                    registroColeta.Peso,
                    registroColeta.DataColeta);

            return query.ToList();
        }

        public List<DadosRegistroColeta> ObterRegistrosPorUsuario(int idUsuario)
        {
            var query = 
                from registroColeta in context.RegistrosColeta
                join pontoColeta in context.PontosColeta on registroColeta.IdPontoColeta equals pontoColeta.Id
                join materialColeta in context.MaterialColeta on registroColeta.IdTipoMaterial equals materialColeta.Id
                where registroColeta.IdUsuario == idUsuario
                select new DadosRegistroColeta(
                    registroColeta.IdRegistroColeta,
                    pontoColeta.Nome,
                    string.Empty,
                    materialColeta.TipoMaterial,
                    materialColeta.Medida,
                    registroColeta.Total,
                    registroColeta.Peso,
                    registroColeta.DataColeta);

            return query.ToList();
        }
    }
}
