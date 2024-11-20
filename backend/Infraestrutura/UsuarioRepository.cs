using Microsoft.EntityFrameworkCore;
using AppReciclagem.Models;
using AppReciclagem.Enums;

namespace AppReciclagem.Infraestrutura
{
    public class UsuarioRepository(
        ConnectionContext context) : IUsuarioRepository
    {
        public Usuario ObterPeloFirebaseUid(string firebaseUid)
        {
            return context.Usuarios.First(f => f.FirebaseUid == firebaseUid);
        }

        public Usuario ObterPeloIdUsuario(int id)
        {
            return context.Usuarios.First(u => u.Id == id);
        }

        public async Task<bool> Exists(Usuario usuario)
        {
            // Verificar se o email, CPF ou CNPJ já existem no banco de dados
            var usuarioExistente = await context.Usuarios
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Email == usuario.Email 
                    || (u.TipoUsuario != (int)TipoUsuario.PontoColeta && u.Cpf == usuario.Cpf) 
                    || (u.TipoUsuario == (int)TipoUsuario.PontoColeta && u.Cnpj == usuario.Cnpj));

            return usuarioExistente != null;
        }

        public void Add(Usuario usuario)
        {
            context.Usuarios.Add(usuario);
            context.SaveChanges();
        }

        public void Update(Usuario usuario)
        {
            context.Usuarios.Update(usuario);
            context.SaveChanges();
        }

        public int ObterPontosAcumulados(int idUsuario)
        {
            return context.Usuarios.First(u => u.Id == idUsuario).PontosAcumulados;
        }
    }
}
