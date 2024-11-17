using AppReciclagem.Models;
using AppReciclagem.ViewModel;
using Microsoft.AspNetCore.Mvc;
using System.Text.RegularExpressions;

namespace AppReciclagem.Controllers
{
    [ApiController]
    [Route("api/v1/pontocoleta")]

    public class PontoColetaController : ControllerBase
    {
        private readonly IPontoColetaRepository pontoColetaRepository;

        public PontoColetaController(IPontoColetaRepository pontoColetaRepository)
        {
            this.pontoColetaRepository = pontoColetaRepository;
        }

        [HttpPost]
        public async Task<IActionResult> Add(PontoColetaViewModel pontoColetaModel) 
        {
            try
            {
                if (pontoColetaModel == null)
                {
                    return BadRequest("Dados do Ponto de Coleta não fornecidos");
                }

                var pontoColeta = new PontoColeta(
                    pontoColetaModel.Nome,
                    Regex.Replace(pontoColetaModel.Cnpj, "[^0-9]", ""),
                    Regex.Replace(pontoColetaModel.Cep, "[^0-9]", ""),
                    pontoColetaModel.Rua,
                    pontoColetaModel.Numero,
                    pontoColetaModel.Bairro,
                    pontoColetaModel.Cidade,
                    pontoColetaModel.Estado);
                
                pontoColetaRepository.Add(pontoColeta);

                return Ok(new { message = "Dados do ponto de coleta cadastrados"});
            }
            catch (Exception ex) 
            {
                return StatusCode(500, new { message = "Erro ao cadastrar dados do ponto de coleta", details = ex.Message });
            }
        }

    }
}
