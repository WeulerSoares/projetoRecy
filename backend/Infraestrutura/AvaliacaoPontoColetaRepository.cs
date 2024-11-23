using AppReciclagem.Models;
using Microsoft.EntityFrameworkCore;

namespace AppReciclagem.Infraestrutura
{
    public class AvaliacaoPontoColetaRepository(
        ConnectionContext context) : IAvaliacaoPontoColetaRepository
    {
        public void Add(AvaliacaoPontoColeta avaliacao)
        {
            context.AvaliacoesPontosColeta.Add(avaliacao);
            context.SaveChanges();
        }

        public async Task<bool> Exists(AvaliacaoPontoColeta avaliacao)
        {
            var avaliacaoExistente = await context.AvaliacoesPontosColeta
                .AsNoTracking()
                .FirstOrDefaultAsync(a => a.IdPontoColeta == avaliacao.IdPontoColeta && a.IdUsuario == avaliacao.IdUsuario);

            return avaliacaoExistente != null;
        }

        public void Update(AvaliacaoPontoColeta avaliacao)
        {
            context.AvaliacoesPontosColeta.Update(avaliacao);
            context.SaveChanges();
        }
    }
}
