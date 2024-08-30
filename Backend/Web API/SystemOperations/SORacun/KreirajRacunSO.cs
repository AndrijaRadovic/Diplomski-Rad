using Common.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.SystemOperations.SORacun
{
    internal class KreirajRacunSO : SystemOperationBase
    {
        private Racun racun;

        public KreirajRacunSO(Racun racun)
        {
            this.racun = racun;
        }

        public override void ExecuteConcreteOperation()
        {
            int id = broker.AddWithId(racun);

            foreach (StavkaRacuna sr in racun.StavkeRacuna)
            {
                sr.Racun.SifraRacuna = id;
                broker.Add(sr);
            }
        }
    }
}
