using Common;
using Common.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.SystemOperations.SORacun
{
    internal class UcitajRacunSO : SystemOperationBase
    {
        private int id;
        public Racun Result { get; set; }

        public UcitajRacunSO(int id)
        {
            this.id = id;
        }

        public override void ExecuteConcreteOperation()
        {
            Result = (Racun)broker.GetEntityById(new Racun { SifraRacuna = id });

            Result.StavkeRacuna = broker.GetAllByFilter(new StavkaRacuna(), Result.SifraRacuna.ToString(), "sifraRacuna").Cast<StavkaRacuna>().ToList();

            // Sme li ovo
            foreach (StavkaRacuna stavka in Result.StavkeRacuna)
            {
                stavka.Racun = Result;
            }
        }
    }
}
