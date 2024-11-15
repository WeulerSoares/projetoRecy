using Microsoft.EntityFrameworkCore;
using AppReciclagem.Models;

namespace AppReciclagem.Infraestrutura
{
    public class UsuarioRepository : IUsuarioRepository
    {
        private readonly ConnectionContext context;

        public UsuarioRepository(ConnectionContext context)
        {
            this.context = context;
        }

        public Usuario Get(string firebaseUid)
        {
            return context.Usuarios.First(f => f.FirebaseUid == firebaseUid);
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
