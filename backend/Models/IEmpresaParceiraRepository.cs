namespace AppReciclagem.Models
{
    public interface IEmpresaParceiraRepository
    {
        IEnumerable<EmpresaParceira> GetAll();

        void Add(EmpresaParceira empresaParceira);

        Task<bool> Exists(EmpresaParceira empresaParceira);

        EmpresaParceira? Get(int idEmpresa);
    }
}
