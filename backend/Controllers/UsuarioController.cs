using Microsoft.AspNetCore.Mvc;
using System.Text.RegularExpressions;
using AppReciclagem.Models;
using AppReciclagem.ViewModel;
using AppReciclagem.Enums;

namespace AppReciclagem.Controllers
{
    [ApiController]
    [Route("api/v1/usuario")]
    public class UsuarioController(
        IUsuarioRepository usuarioRepository) : ControllerBase
    {
        [HttpGet("{firebaseUid}")]
        public IActionResult Get(string firebaseUid)
        {
            var usuario = usuarioRepository.ObterPeloFirebaseUid(firebaseUid);

            return Ok(usuario);
        }

        [HttpGet("{cpf}/cpf")]
        public IActionResult GetByCPF(string cpf)
        {
            var usuario = usuarioRepository.ObterPeloCPFUsuario(cpf);

            return Ok(usuario);
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

                var usarCpf = usuarioViewModel.TipoUsuario == (int)TipoUsuario.Coletor && !string.IsNullOrWhiteSpace(usuarioViewModel.Cpf);
                var usarCnpj = usuarioViewModel.TipoUsuario == (int)TipoUsuario.PontoColeta && !string.IsNullOrWhiteSpace(usuarioViewModel.Cnpj);

                var usuario = new Usuario(
                    usuarioViewModel.FirebaseUid,
                    usuarioViewModel.Nome,
                    usuarioViewModel.Email,
                    usuarioViewModel.DataNascimento,
                    0,
                    usuarioViewModel.TipoUsuario,
                    usarCpf ? Regex.Replace(usuarioViewModel.Cpf, "[^0-9]", "") : null,
                    usarCnpj ? Regex.Replace(usuarioViewModel.Cnpj, "[^0-9]", "") : null);

                if (await usuarioRepository.Exists(usuario))
                {
                    return BadRequest("Email, CPF ou CNPJ já estão em uso.");
                }

                usuarioRepository.Add(usuario);

                return Ok(new { message = $"Usuário {usuario.Nome} cadastrado com sucesso!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro ao cadastrar usuário", details = ex.Message });
            }
        }

        [HttpPost]
        [Route("foto")]
        public async Task<IActionResult> AddFoto([FromForm] FotoUsuarioViewModel fotoUsuarioViewModel)
        {
            try
            {
                if (fotoUsuarioViewModel == null)
                {
                    return BadRequest("Dados do usuário não fornecidos.");
                }

                var fotoPath = Path.Combine("Storage\\Usuarios", $"{fotoUsuarioViewModel.IdUsuario}.png");

                using Stream fileStream = new FileStream(fotoPath, FileMode.Create);
                fotoUsuarioViewModel.Foto.CopyTo(fileStream);

                var usuario = usuarioRepository.ObterPeloIdUsuario(fotoUsuarioViewModel.IdUsuario);

                usuario.FotoPath = fotoPath;

                usuarioRepository.Update(usuario);

                return Ok(new { message = "Foto usuário salva com sucesso!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro ao salvar foto usuário", details = ex.Message });
            }
        }

        [HttpGet]
        [Route("{id}/foto")]
        public IActionResult GetFoto(int id)
        {
            var usuario = usuarioRepository.ObterPeloIdUsuario(id);
            var fotoPath = usuario.FotoPath;

            if (!string.IsNullOrWhiteSpace(fotoPath) && System.IO.File.Exists(fotoPath))
            {
                var fileStream = System.IO.File.OpenRead(fotoPath);
                return File(fileStream, "image/png");
            }
            else
            {
                return NotFound("Foto não encontrada.");
            }
        }

        [HttpPut("{idUsuario}")]
        public IActionResult Update(int idUsuario, [FromBody] Usuario usuario) 
        {
            if (idUsuario == null || idUsuario != usuario.Id) 
            {
                return BadRequest("Dados inválidos ou ID não corresponde ao objeto fornecido.");
            }

            try
            {
                usuarioRepository.Update(usuario);
                return Ok("Usuário atualizado com sucesso!");
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro ao atualizar usuário", details = ex.Message });
            }
        }

        [HttpGet("{idUsuario}/pontos")]
        public IActionResult ObterPontos(int idUsuario)
        {
            try
            {
                var pontos = usuarioRepository.ObterPontosAcumulados(idUsuario);

                return Ok(pontos);
            } 
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro ao buscar pontos acumulados usuário.", details = ex.Message });
            }
        }
    }
}
