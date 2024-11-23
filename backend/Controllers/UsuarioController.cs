using Microsoft.AspNetCore.Mvc;
using System.Text.RegularExpressions;
using AppReciclagem.Models;
using AppReciclagem.ViewModel;

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

                if (System.IO.File.Exists(fotoPath))
                {
                    System.IO.File.Delete(fotoPath);
                }

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
    }
}
