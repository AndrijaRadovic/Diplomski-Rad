using Common.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.SystemOperations.SORacun
{
    internal class IzmeniRacunSO : SystemOperationBase
    {
        private Racun racun;

        public IzmeniRacunSO(Racun racun)
        {
            this.racun = racun;
        }

        public override void ExecuteConcreteOperation()
        {
            StavkaRacuna stavka = new StavkaRacuna
            {
                Racun = new Racun
                {
                    SifraRacuna = racun.SifraRacuna
                }
            };

            broker.Delete(stavka, "deleteAll");
            broker.Update(racun);
            foreach(StavkaRacuna s in racun.StavkeRacuna)
            {
                broker.Add(s);
            }
        }
    }
}
