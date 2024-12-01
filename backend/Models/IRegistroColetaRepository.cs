namespace AppReciclagem.Models
{
    public interface IRegistroColetaRepository
    {
        void Add(RegistroColeta registroColeta);

        List<DadosRegistroColeta> GetAll(int idPontoColeta);

        List<DadosRegistroColeta> ObterRegistrosPorUsuario(int idUsuario);
    }
}
