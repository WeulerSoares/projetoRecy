using Microsoft.EntityFrameworkCore;
using TesteApi.Models;

namespace TesteApi.Infraestrutura
{
    public class UsuarioRepository : IUsuarioRepository
    {
        private readonly ConnectionContext context;

        public UsuarioRepository(ConnectionContext context)
        {
            this.context = context;
        }

        public List<Usuario> GetAll()
        {
            return context.Usuarios.ToList();
        }

        public async Task<bool> Exists(Usuario usuario)
        {
            // Verificar se o email, CPF ou CNPJ já existem no banco de dados
            var usuarioExistente = await context.Usuarios
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Email == usuario.Email || u.Cpf == usuario.Cpf || u.Cnpj == usuario.Cnpj);

            return usuarioExistente != null;
        }

        public void Add(Usuario usuario)
        {
            context.Usuarios.Add(usuario);
            context.SaveChanges();
        }
    }
}
