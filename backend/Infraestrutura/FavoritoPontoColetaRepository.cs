using AppReciclagem.Models;
using Microsoft.EntityFrameworkCore;

namespace AppReciclagem.Infraestrutura
{
    public class FavoritoPontoColetaRepository(
        ConnectionContext context) : IFavoritoPontoColetaRepository
    {
        public void Add(FavoritoPontoColeta favorito)
        {
            context.PontosColetaFavoritos.Add(favorito);
            context.SaveChanges();
        }

        public void Delete(FavoritoPontoColeta favorito)
        {
            context.PontosColetaFavoritos.Remove(favorito);
            context.SaveChanges();
        }

        public async Task<bool> Exists(FavoritoPontoColeta favorito)
        {
            var favoritoExistente = await context.PontosColetaFavoritos
                .AsNoTracking()
                .FirstOrDefaultAsync(f => f.IdPontoColeta == favorito.IdPontoColeta && f.IdUsuario == favorito.IdUsuario);

            return favoritoExistente != null;
        }

        public IEnumerable<PontoColetaFavorito> ObterPontosColetaFavoritos(int idUsuario)
        {
            var mediasAvaliacoes = context.AvaliacoesPontosColeta
                .GroupBy(a => a.IdPontoColeta)
                .Select(g => new
                {
                    IdPontoColeta = g.Key,
                    MediaAvaliacao = g.Average(a => a.Avaliacao)
                });

            var query =
                from favorito in context.PontosColetaFavoritos
                join pontoColeta in context.PontosColeta on favorito.IdPontoColeta equals pontoColeta.Id
                join media in mediasAvaliacoes on pontoColeta.Id equals media.IdPontoColeta into mediaGroup
                from media in mediaGroup.DefaultIfEmpty()
                where favorito.IdUsuario == idUsuario
                select new PontoColetaFavorito(
                    favorito.IdPontoColeta,
                    pontoColeta.Nome,
                    true,
                    media.MediaAvaliacao);

            return query.ToList();
        }
    }
}
