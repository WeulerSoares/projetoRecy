using Microsoft.AspNetCore.Mvc;
using System.Text.RegularExpressions;
using AppReciclagem.Infraestrutura;
using AppReciclagem.Models;
using AppReciclagem.ViewModel;

namespace AppReciclagem.Controllers
{
    [ApiController]
    [Route("api/v1/usuario")]
    public class UsuarioController : ControllerBase
    {
        private readonly IUsuarioRepository usuarioRepository;

        public UsuarioController(IUsuarioRepository usuarioRepository)
        {
            this.usuarioRepository = usuarioRepository;
        }

        [HttpGet("{firebaseUid}")]
        public IActionResult Get(string firebaseUid)
        {
            var usuarios = usuarioRepository.Get(firebaseUid);

            return Ok(usuarios);
        }

        [HttpPost]
        public async Task<IActionResult> Add(UsuarioViewModel usuarioViewModel)
        {
            try
            {
                if (usuarioViewModel == null)
                {
                    return BadRequest("Dados do usuário não fornecidos.");
                }

                var usuario = new Usuario(
                    usuarioViewModel.FirebaseUid,
                    usuarioViewModel.Nome,
                    usuarioViewModel.Email,
                    usuarioViewModel.DataNascimento,
                    0,
                    usuarioViewModel.TipoUsuario.Equals("Coletor") ? 1 : 2,
                    Regex.Replace(usuarioViewModel.Cpf, "[^0-9]", ""),
                    Regex.Replace(usuarioViewModel.Cnpj, "[^0-9]", ""));

                if (await usuarioRepository.Exists(usuario))
                {
                    return BadRequest("Email, CPF ou CNPJ já estão em uso.");
                }

                usuarioRepository.Add(usuario);

                return Ok(new { message = "Usuário cadastrado com sucesso!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro ao cadastrar usuário", details = ex.Message });
            }
        }
    }
}
