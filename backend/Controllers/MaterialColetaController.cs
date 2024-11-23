using AppReciclagem.Models;
using AppReciclagem.ViewModel;
using Microsoft.AspNetCore.Mvc;

namespace AppReciclagem.Controllers
{
    [ApiController]
    [Route("api/v1/materialColeta")]
    public class MaterialColetaController(
        IMaterialColetaRepository materialColetaRepository) : ControllerBase
    {
        [HttpGet("{idPontoColeta}")]
        public IActionResult GetAll(int idPontoColeta) 
        {
            var material = materialColetaRepository.GetAll(idPontoColeta);

            return Ok(material);
        }

        [HttpGet("{idTipoMaterial}/tipoMaterial")]
        public IActionResult Get(int idTipoMaterial)
        {
            var material = materialColetaRepository.Get(idTipoMaterial);

            return Ok(material);
        }

        [HttpDelete("{idMaterialColeta}")]
        public IActionResult Delete(int idMaterialColeta)
        {
            try
            {
                materialColetaRepository.Delete(idMaterialColeta);
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro ao deletar material", details = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> Add(MaterialColetaViewModel materialColetaViewModel)
        {
            try
            {
                if (materialColetaViewModel == null)
                {
                    return BadRequest("Dados do material não fornecidos");
                }

                var materialColeta = new MaterialColeta(
                    materialColetaViewModel.IdPontoColeta,
                    materialColetaViewModel.TipoMaterial,
                    materialColetaViewModel.Medida,
                    materialColetaViewModel.Preco);

                if (await materialColetaRepository.Exists(materialColeta))
                {
                    return BadRequest("Tipo de material já cadastrado para o ponto de coleta.");
                }

                materialColetaRepository.Add(materialColeta);

                return Ok(new { message = "Material cadastrado com sucesso!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro ao cadastrar material", details = ex.Message });
            }
        }

        [HttpPut("{idMaterialColeta}")]
        public IActionResult Update(int idMaterialColeta, [FromBody] MaterialColeta materialColeta)
        {
            if (idMaterialColeta == null || idMaterialColeta != materialColeta.Id)
            {
                return BadRequest("Dados inválidos ou ID não corresponde ao objeto fornecido.");
            }

            try
            {
                materialColetaRepository.Update(materialColeta);

                return Ok("Material atualizado com sucesso!");
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro ao atualizar material", details = ex.Message });
            }
        }
    }
}
