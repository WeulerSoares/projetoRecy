namespace AppReciclagem.Models
{
    public interface IRegistroColetaRepository
    {
        void Add(RegistroColeta registroColeta);

        List<RegistroColeta> GetAll(int idPontoColeta);
    }
}
