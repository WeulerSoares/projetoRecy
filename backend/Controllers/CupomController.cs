using AppReciclagem.Models;
using AppReciclagem.ViewModel;
using Microsoft.AspNetCore.Mvc;

namespace AppReciclagem.Controllers
{
    [ApiController]
    [Route("api/v1/cupom")]
    public class CupomController(
        ICupomRepository cupomRepository) : ControllerBase
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
    }
}
