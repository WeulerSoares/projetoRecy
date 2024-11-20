using AppReciclagem.Infraestrutura;
using AppReciclagem.Models;
using AppReciclagem.ViewModel;
using Microsoft.AspNetCore.Mvc;

namespace AppReciclagem.Controllers
{
    [ApiController]
    [Route("api/v1/cupom")]
    public class CupomController(ICupomRepository cupomRepository) : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            var cupons = cupomRepository.GetAllActive();

            return Ok(cupons);
        }

        [HttpPost]
        public async Task<IActionResult> Add(CupomViewModel cupomViewModel)
        {
            try
            {
                if (cupomViewModel == null)
                {
                    return BadRequest("Dados do cupom não fornecidos.");
                }

                var cupom = new Cupom(
                    cupomViewModel.IdEmpresa,
                    cupomViewModel.Valor,
                    cupomViewModel.Quantidade,
                    cupomViewModel.Pontos);

                cupomRepository.Add(cupom);

                return Ok(new { message = "Cupom cadastrado com sucesso!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro ao cadastrar cupom", details = ex.Message });
            }
        }

        [HttpPost]
        [Route("{idCupom}/usuario/{idUsuario}")]
        public async Task<IActionResult> ResgatarCupom(int idCupom, int idUsuario)
        {
            try
            {
                if (idCupom == 0 || idUsuario == 0)
                {
                    return BadRequest(new { message = "Dados para trocar os pontos não fornecidos." });
                }

                var mensagemResgate = cupomRepository.ResgatarCupom(idCupom, idUsuario);

                if (!string.IsNullOrWhiteSpace(mensagemResgate))
                {
                    return BadRequest(new { message = mensagemResgate });
                }

                return Ok(new { message = "Cupom resgatado com sucesso!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro ao resgatar cupom", details = ex.Message });
            }
        }
    }
}
