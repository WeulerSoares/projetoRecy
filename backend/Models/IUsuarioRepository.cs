namespace TesteApi.Models
{
    public interface IUsuarioRepository
    {
        List<Usuario> GetAll();

        void Add(Usuario usuario);

        Task<bool> Exists(Usuario usuario);
    }
}
