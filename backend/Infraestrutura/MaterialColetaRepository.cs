using AppReciclagem.Models;
using Microsoft.EntityFrameworkCore;

namespace AppReciclagem.Infraestrutura
{
    public class MaterialColetaRepository(ConnectionContext context) : IMaterialColetaRepository
    {
        public void Add(MaterialColeta materialColeta)
        {
            context.MaterialColeta.Add(materialColeta);
            context.SaveChanges();
        }

        public void Delete(int id_material_coleta)
        {
            var material = context.MaterialColeta.Find(id_material_coleta);

            if (material != null)
            {
                context.MaterialColeta.Remove(material);
                context.SaveChanges();
            }
            else 
            {
                throw new Exception($"Não encontrado o material de ID{id_material_coleta}.");
            }
        }

        public async Task<bool> Exists(MaterialColeta materialColeta)
        {
            var materialExistente = await context.MaterialColeta
                .AsNoTracking()
                .FirstOrDefaultAsync(m => m.IdPontoColeta == materialColeta.IdPontoColeta && m.TipoMaterial == materialColeta.TipoMaterial);
            
            return materialExistente != null;
        }

        public MaterialColeta Get(int idTipoMaterial)
        {
            return context.MaterialColeta.First(m => m.Id == idTipoMaterial);
        }

        public List<MaterialColeta> GetAll(int idPontoColeta)
        {
            return context.MaterialColeta
                .Where(material => material.IdPontoColeta == idPontoColeta)
                .ToList();
        }

        public void Update(MaterialColeta materialColeta)
        {
            context.MaterialColeta.Update(materialColeta);
            context.SaveChanges();
        }
    }
}
