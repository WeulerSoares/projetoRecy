using AppReciclagem.Models;
using AppReciclagem.ViewModel;
using Microsoft.AspNetCore.Mvc;
using System.Text.RegularExpressions;

namespace AppReciclagem.Controllers
{
    [ApiController]
    [Route("api/v1/empresaParceira")]
    public class EmpresaParceiraController(
        IEmpresaParceiraRepository empresaParceiraRepository) : ControllerBase
    {
        [HttpGet]
        [Route("paraFiltro")]
        public IActionResult Get()
        {
            var empresasParceira = empresaParceiraRepository.GetAll();

            return Ok(empresasParceira);
        }

        [HttpGet]
        [Route("{id}/logo")]
        public IActionResult Get(int id)
        {
            var empresasParceira = empresaParceiraRepository.Get(id);

            var logoPath = empresasParceira.LogoPath;

            if (!string.IsNullOrWhiteSpace(logoPath) && System.IO.File.Exists(logoPath))
            {
                var fileStream = System.IO.File.OpenRead(logoPath);
                return File(fileStream, "image/png");
            }
            else
            {
                return NotFound(new { message = "Logo não encontrada." });
            }
        }

        [HttpPost]
        public async Task<IActionResult> Add([FromForm] EmpresaParceiraViewModel empresaParceiraViewModel)
        {
            try
            {
                if (empresaParceiraViewModel == null)
                {
                    return BadRequest(new { message = "Dados da empresa parceira não fornecidas." });
                }

                var cnpjSemCaracteresEspeciais = Regex.Replace(empresaParceiraViewModel.Cnpj, "[^0-9]", "");
                var logoPath = Path.Combine("Storage\\EmpresasParceira", $"{cnpjSemCaracteresEspeciais}.png");

                using Stream fileStream = new FileStream(logoPath, FileMode.Create);
                empresaParceiraViewModel.Logo.CopyTo(fileStream);

                var empresaParceira = new EmpresaParceira(
                    cnpjSemCaracteresEspeciais,
                    empresaParceiraViewModel.Nome,
                    empresaParceiraViewModel.Email,
                    logoPath);

                if (await empresaParceiraRepository.Exists(empresaParceira))
                {
                    return BadRequest(new { message = "Email, CPF ou CNPJ já estão em uso." });
                }

                empresaParceiraRepository.Add(empresaParceira);

                return Ok(new { message = "Empresa parceira cadastrada com sucesso!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro ao cadastrar empresa parceira", details = ex.Message });
            }
        }
    }
}
