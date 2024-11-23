using AppReciclagem.Models;
using AppReciclagem.ViewModel;
using Microsoft.AspNetCore.Mvc;

namespace AppReciclagem.Controllers
{
    [ApiController]
    [Route("api/v1/registroColeta")]
    public class RegistroColetaController(
        IRegistroColetaRepository registroColetaRepository) : ControllerBase
    {

        [HttpGet("{idPontoColeta}")]
        public IActionResult GetAll(int idPontoColeta)
        {
            var registros = registroColetaRepository.GetAll(idPontoColeta);

            return Ok(registros);
        }

        [HttpPost]
        public async Task<IActionResult> Add(RegistroColetaViewModel registroColetaViewModel) 
        {
            DateTime dataColeta = DateTime.Now;
            try
            {
                var registro = new RegistroColeta(
                    registroColetaViewModel.IdPontoColeta,
                    registroColetaViewModel.IdFirebaseCliente,
                    registroColetaViewModel.IdTipoMaterial,
                    registroColetaViewModel.CPFCliente,
                    registroColetaViewModel.Total,
                    registroColetaViewModel.Peso,
                    dataColeta
                    );

                registroColetaRepository.Add(registro);

                return Ok(new { message = "Registro cadastrado com sucesso" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro ao registrar coleta", details = ex.Message });
            }
        }


    }
}
