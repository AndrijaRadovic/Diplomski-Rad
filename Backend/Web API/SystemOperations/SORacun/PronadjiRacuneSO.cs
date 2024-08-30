using Common;
using Common.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.SystemOperations.SORacun
{
    internal class PronadjiRacuneSO : SystemOperationBase
    {
        private DateTime datum;

        public PronadjiRacuneSO(DateTime datum)
        {
            this.datum = datum;
        }

        public List<IEntity> Result { get; set; }
        public override void ExecuteConcreteOperation()
        {
            Result = broker.GetAllByFilter(new Racun(), datum.ToShortDateString());

            foreach (IEntity entity in Result)
            {
                ((Racun)entity).StavkeRacuna = broker.GetAllByFilter(new StavkaRacuna(), ((Racun)entity).SifraRacuna.ToString(), "sifraRacuna").Cast<StavkaRacuna>().ToList();
            }

            foreach (IEntity entity in Result)
            {
                foreach (StavkaRacuna stavka in ((Racun)entity).StavkeRacuna)
                {
                    stavka.Racun = (Racun)entity;
                }
            }
        }
    }
}
