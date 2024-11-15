namespace AppReciclagem.Models
{
    public interface IUsuarioRepository
    {
        Usuario Get(string firebaseUid);

        void Add(Usuario usuario);

        Task<bool> Exists(Usuario usuario);
    }
}
