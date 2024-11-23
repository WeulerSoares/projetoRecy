namespace AppReciclagem.ViewModel
{
    public class RegistroColetaViewModel
    {
        public int IdPontoColeta {  get; set; }

        public string IdFirebaseCliente { get; set; }

        public int IdTipoMaterial { get; set; }

        public string CPFCliente { get; set; }

        public double Peso { get; set; }

        public double Total { get; set; }

        public DateTime DataColeta { get; set; }
    }
}
