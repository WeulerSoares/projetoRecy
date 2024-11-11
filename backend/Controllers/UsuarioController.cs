using Microsoft.AspNetCore.Mvc;
using TesteApi.Infraestrutura;
using TesteApi.Models;
using TesteApi.ViewModel;

namespace TesteApi.Controllers
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

        [HttpGet]
        public IActionResult Get()
        {
            var usuarios = usuarioRepository.GetAll();

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
                    null,
                    0,
                    usuarioViewModel.TipoUsuario,
                    usuarioViewModel.Cpf,
                    usuarioViewModel.Cnpj);

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
