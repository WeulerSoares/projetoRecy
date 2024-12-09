using AppReciclagem.Models;

namespace AppReciclagem.Infraestrutura
{
    public class PontoColetaRepository(ConnectionContext context) : IPontoColetaRepository
    {
        public PontoColeta? Get(int idUsuario)
        {
            var response = context.PontosColeta.FirstOrDefault(item => item.IdUsuario == idUsuario);
            return response;
        }

        public PerfilPontoColeta ObterPerfilPontoColeta(int id, int idUsuario)
        {
            var query =
                from pontoColeta in context.PontosColeta
                join avaliacaoPontoColeta in context.AvaliacoesPontosColeta
                    on new { IdPontoColeta = pontoColeta.Id, IdUsuario = idUsuario }
                    equals new { avaliacaoPontoColeta.IdPontoColeta, avaliacaoPontoColeta.IdUsuario } into avaliacaoGroup
                from avaliacao in avaliacaoGroup.DefaultIfEmpty()
                join favorito in context.PontosColetaFavoritos
                    on new { IdPontoColeta = pontoColeta.Id, IdUsuario = idUsuario }
                    equals new { favorito.IdPontoColeta, favorito.IdUsuario } into favoritoGroup
                from favorito in favoritoGroup.DefaultIfEmpty()
                where pontoColeta.Id == id
                select new PerfilPontoColeta(
                    pontoColeta.Id,
                    pontoColeta.Nome,
                    favorito != null,
                    avaliacao != null ? avaliacao.Avaliacao : 0,
                    null,
                    "Informações sobre os materiais, valores e especificações para cada material");

            var perfilPontoColeta = query.First();

            var materiais = context.MaterialColeta.Where(item => item.IdPontoColeta == id).ToList();

            perfilPontoColeta.Materiais = materiais;

            return perfilPontoColeta;
        }

        public List<PontoColeta> GetAll()
        {
            var response = context.PontosColeta.ToList();
            return response; 
        }

        public void Add(PontoColeta pontoColeta)
        {
            context.PontosColeta.Add(pontoColeta);
            context.SaveChanges();
        }

        public void Delete(int idPontoColeta)
        {
            var pontoColeta = context.PontosColeta.Find(idPontoColeta);

            if (pontoColeta != null)
            {
                context.PontosColeta.Remove(pontoColeta);
                context.SaveChanges();
            }
            else
            {
                throw new Exception($"Não encontrado o material de ID{idPontoColeta}.");
            }
        }

        public void Update(PontoColeta pontoColeta)
        {
            context.PontosColeta.Update(pontoColeta);
            context.SaveChanges();
        }

        public List<PontoColeta> GetInRange(
            double range,
            double latitude,
            double longitude)
        {
            var pontosColeta = context.PontosColeta.ToList();

            var pontosProximos = pontosColeta
                .Where(ponto => CalculateHaversine(latitude, longitude, ponto.Latitude, ponto.Longitude) <= range)
                .ToList();

            return pontosProximos;
        }

        public IEnumerable<PontoColetaPesquisa> ObterPontosColeta(
            int idUsuario,
            double range,
            double latitude,
            double longitude,
            string tipoMaterial)
        {
            var mediasAvaliacoes = context.AvaliacoesPontosColeta
                .GroupBy(a => a.IdPontoColeta)
                .Select(g => new
                {
                    IdPontoColeta = g.Key,
                    MediaAvaliacao = g.Average(a => a.Avaliacao)
                });

            var query =
                from pontoColeta in context.PontosColeta
                join media in mediasAvaliacoes on pontoColeta.Id equals media.IdPontoColeta into mediaGroup
                from media in mediaGroup.DefaultIfEmpty()
                join favorito in context.PontosColetaFavoritos
                    on new { IdPontoColeta = pontoColeta.Id, IdUsuario = idUsuario }
                    equals new { favorito.IdPontoColeta, favorito.IdUsuario } into favoritoGroup
                from favorito in favoritoGroup.DefaultIfEmpty()

                select new PontoColetaPesquisa(
                    pontoColeta.Id,
                    pontoColeta.Nome,
                    favorito != null,
                    media.MediaAvaliacao,
                    $"{pontoColeta.Rua}, Nº {pontoColeta.Numero}, {pontoColeta.Bairro}, {pontoColeta.Cidade}, {pontoColeta.Estado}",
                    pontoColeta.Latitude,
                    pontoColeta.Longitude);

            var pontosColeta = query.ToList();
            var idsPontosColeta = pontosColeta.Select(f => f.IdPontoColeta);
            
            if (!string.IsNullOrWhiteSpace(tipoMaterial))
            {
                var materiais = context.MaterialColeta.Where(f => f.TipoMaterial == tipoMaterial && idsPontosColeta.Contains(f.IdPontoColeta));

                foreach (var pontoColeta in pontosColeta)
                {
                    var material = materiais.FirstOrDefault(f => f.IdPontoColeta == pontoColeta.IdPontoColeta);
                    
                    if (material != null)
                    {
                        pontoColeta.TipoMaterial = material.TipoMaterial;
                        pontoColeta.PrecoMaterial = material.Preco;
                        pontoColeta.TipoMedida = material.Medida; 
                    }
                }

                var idsPontosColetaRemover = idsPontosColeta.Except(materiais.Select(f => f.IdPontoColeta));

                pontosColeta.RemoveAll(f => idsPontosColetaRemover.Contains(f.IdPontoColeta));
            }

            return pontosColeta.Where(f => this.CalculateHaversine(
                latitude,
                longitude,
                f.Latitude,
                f.Longitude) <= range);
        }

        private double CalculateHaversine(double lat1, double lon1, double lat2, double lon2)
        {
            // Raio da Terra
            var R = 6371;

            // Transforma a diferença em graus
            var lat1Rad = ToRadians(lat1);
            var lon1Rad = ToRadians(lon1);
            var lat2Rad = ToRadians(lat2);
            var lon2Rad = ToRadians(lon2);

            // Obtem a relativização
            var dLat = lat2Rad - lat1Rad;
            var dLon = lon2Rad - lon1Rad;

            var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
            Math.Cos(lat1Rad) * Math.Cos(lat2Rad) *
            Math.Sin(dLon / 2) * Math.Sin(dLon / 2);

            var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));

            return R * c; // Distância em km
        }

        public static double ToRadians(double degree) 
        {
            return degree * (Math.PI / 100);
        }

        public string ObterCaminhoFoto(int idPontoColeta)
        {
            var response =
                from pontoColeta in context.PontosColeta
                join usuario in context.Usuarios on pontoColeta.IdUsuario equals usuario.Id
                where pontoColeta.Id == idPontoColeta
                select usuario.FotoPath;

            return response.First();
        }
    }
}
