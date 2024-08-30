using Common.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.SystemOperations.SORacun
{
    internal class StornirajRacunSO : SystemOperationBase
    {
        private Racun racun;

        public StornirajRacunSO(Racun racun)
        {
            this.racun = racun;
        }

        public override void ExecuteConcreteOperation()
        {
            int id = broker.AddWithId(racun);
            broker.Update(racun, "statusRacuna");

            foreach (StavkaRacuna sr in racun.StavkeRacuna)
            {
                sr.Racun.SifraRacuna = id;
                broker.Add(sr);
            }
        }
    }
}
