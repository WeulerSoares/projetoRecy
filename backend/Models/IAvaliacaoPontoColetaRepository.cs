namespace AppReciclagem.Models
{
    public interface IAvaliacaoPontoColetaRepository
    {
        void Add(AvaliacaoPontoColeta avaliacao);

        Task<bool> Exists(AvaliacaoPontoColeta avaliacao);

        void Update(AvaliacaoPontoColeta avaliacao);
    }
}
