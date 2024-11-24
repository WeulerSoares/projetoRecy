namespace AppReciclagem.Models
{
    public interface IUsuarioRepository
    {
        Usuario ObterPeloFirebaseUid(string firebaseUid);

        Usuario ObterPeloIdUsuario(int id);

        Usuario? ObterPeloCPFUsuario(string cpf);

        void Add(Usuario usuario);

        Task<bool> Exists(Usuario usuario);

        void Update(Usuario usuario);

        int ObterPontosAcumulados(int idUsuario);
    }
}
