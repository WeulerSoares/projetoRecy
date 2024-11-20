using AppReciclagem.Models;

namespace AppReciclagem.Infraestrutura
{
    public class CupomRepository
        (ConnectionContext context) : ICupomRepository
    {
        public IEnumerable<CupomVisualizacao> GetAllActive()
        {
            var query = 
                from cupom in context.Cupons
                join empresa in context.EmpresasParceira
                on cupom.IdEmpresa equals empresa.IdEmpresa
                where cupom.QuantidadeEstoque > 0
                select new CupomVisualizacao(
                    cupom.IdCupom,
                    empresa.IdEmpresa,
                    empresa.Nome,
                    cupom.Pontos,
                    cupom.Valor / cupom.Quantidade);

            return query.ToList();
        }

        public void Add(Cupom cupom)
        {
            context.Cupons.Add(cupom);
            context.SaveChanges();
        }

        public string ResgatarCupom(int idCupom, int idUsuario)
        {
            using (var transaction = context.Database.BeginTransaction())
            {
                var cupom = context.Cupons
                    .Where(f => f.IdCupom == idCupom && f.QuantidadeEstoque > 0)
                    .FirstOrDefault();

                if (cupom == null)
                {
                    return "Cupom expirado.";
                }

                var usuario = context.Usuarios
                    .Where(f => f.Id == idUsuario && f.PontosAcumulados >= cupom.Pontos)
                    .FirstOrDefault();

                if (usuario == null)
                {
                    return "Não há pontos suficientes para troca.";
                }

                cupom.QuantidadeEstoque--;
                usuario.PontosAcumulados -= cupom.Pontos;

                var historico = new HistoricoResgateCupom
                {
                    IdUsuario = idUsuario,
                    IdCupom = idCupom,
                    DataResgate = DateTime.Now,
                };

                context.ResgatesCupons.Add(historico);

                context.SaveChanges();

                transaction.Commit();

                return string.Empty;
            }
        }
    }
}
