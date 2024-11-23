namespace AppReciclagem.Models
{
    public interface IMaterialColetaRepository
    {
        MaterialColeta Get(int idTipoMaterial);

        List<MaterialColeta> GetAll(int idPontoColeta);

        void Add(MaterialColeta materialColeta);

        void Update(MaterialColeta materialColeta);

        void Delete(int id_material_coleta);

        Task<bool> Exists(MaterialColeta materialColeta);
    }
}
