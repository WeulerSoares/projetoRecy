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

        [HttpGet("usuario/{idUsuario}")]
        public IActionResult Get(int idUsuario) 
        {
            try
            {
                var pontoColeta = pontoColetaRepository.Get(idUsuario);
                return Ok(pontoColeta);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro ao obter dados do ponto de coleta", details = ex.Message });
            }
        }

        [HttpGet("{idPontoColeta}/usuario/{idUsuario}")]
        public IActionResult ObterPerfilPontoColeta(int idPontoColeta, int idUsuario)
        {
            try
            {
                var pontoColeta = pontoColetaRepository.ObterPerfilPontoColeta(idPontoColeta, idUsuario);
                return Ok(pontoColeta);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro ao obter dados do ponto de coleta", details = ex.Message });
            }
        }

        [HttpGet("/all")]
        public IActionResult GetAll()
        {
            try
            {
                var pontoColeta = pontoColetaRepository.GetAll();
                return Ok(pontoColeta);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro ao cadastrar dados do ponto de coleta", details = ex.Message });
            }
        }

        [HttpGet("range/{raio}/{latitude}/{longitude}")]
        public IActionResult GetByRange(double raio, double latitude, double longitude)
        {
            try
            {
                var pontosColeta = pontoColetaRepository.GetInRange(raio, latitude, longitude);
                return Ok(pontosColeta);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro ao cadastrar dados do ponto de coleta", details = ex.Message });
            }
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
                    pontoColetaModel.IdUsuario,
                    pontoColetaModel.Nome,
                    Regex.Replace(pontoColetaModel.Cnpj, "[^0-9]", ""),
                    Regex.Replace(pontoColetaModel.Cep, "[^0-9]", ""),
                    pontoColetaModel.Rua,
                    pontoColetaModel.Numero,
                    pontoColetaModel.Bairro,
                    pontoColetaModel.Cidade,
                    pontoColetaModel.Estado,
                    pontoColetaModel.Latitude,
                    pontoColetaModel.Longitude);
                
                pontoColetaRepository.Add(pontoColeta);

                return Ok(new { message = "Dados do ponto de coleta cadastrados"});
            }
            catch (Exception ex) 
            {
                return StatusCode(500, new { message = "Erro ao cadastrar dados do ponto de coleta", details = ex.Message });
            }
        }

        [HttpPut]
        public IActionResult Update(PontoColeta pontoColeta) 
        {
            try
            {
                pontoColeta.Cep = Regex.Replace(pontoColeta.Cep, "[^0-9]", "");
                pontoColetaRepository.Update(pontoColeta);
                return Ok("Ponto de coleta atualizado com sucesso!");
            }
            catch(Exception ex)
            {
                return StatusCode(500, new { message = "Erro ao atualizar ponto de coleta", details = ex.Message });
            }
        }

        [HttpDelete("{idPontoColeta}")]
        public IActionResult Delete(int idPontoColeta) 
        {
            try
            {
                pontoColetaRepository.Delete(idPontoColeta);
                return Ok("Ponto de coleta deletado com sucesso!");
            }
            catch(Exception ex)
            {
                return StatusCode(500, new { message = "Erro ao deletar ponto de coleta", details = ex.Message });
            }
        }

        [HttpGet]
        [Route("{id}/foto")]
        public IActionResult GetFoto(int id)
        {
            var fotoPath = pontoColetaRepository.ObterCaminhoFoto(id);

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
    }
}
