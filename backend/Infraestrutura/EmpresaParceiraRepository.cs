using AppReciclagem.Models;
using Microsoft.EntityFrameworkCore;

namespace AppReciclagem.Infraestrutura
{
    public class EmpresaParceiraRepository(
        ConnectionContext context) : IEmpresaParceiraRepository
    {
        public IEnumerable<EmpresaParceira> GetAll()
        {
            return context.EmpresasParceira.ToList();
        }

        public async Task<bool> Exists(EmpresaParceira empresaParceira)
        {
            var empresaParceiraExistente = await context.EmpresasParceira
                .AsNoTracking()
                .FirstOrDefaultAsync(e => e.Cnpj == empresaParceira.Cnpj || e.Email == empresaParceira.Email);

            return empresaParceiraExistente != null;
        }

        public void Add(EmpresaParceira empresaParceira)
        {
            context.EmpresasParceira.Add(empresaParceira);
            context.SaveChanges();
        }

        public EmpresaParceira? Get(int idEmpresa)
        {
            return context.EmpresasParceira.Find(idEmpresa);
        }
    }
}
