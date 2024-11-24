namespace AppReciclagem.Models
{
    public interface IFavoritoPontoColetaRepository
    {
        void Add(FavoritoPontoColeta favorito);

        Task<bool> Exists(FavoritoPontoColeta favorito);

        void Delete(FavoritoPontoColeta favorito);

        IEnumerable<PontoColetaFavorito> ObterPontosColetaFavoritos(int IdUsuario);
    }
}
