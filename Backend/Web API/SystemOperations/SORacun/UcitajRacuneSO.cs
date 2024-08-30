using Common;
using Common.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.SystemOperations.SORacun
{
    internal class UcitajRacuneSO : SystemOperationBase
    {
        public List<IEntity> result = new List<IEntity>();
        public override void ExecuteConcreteOperation()
        {
            result = broker.GetAll(new Racun());

            foreach(IEntity entity in result)
            {
                ((Racun)entity).StavkeRacuna = broker.GetAllByFilter(new StavkaRacuna(), ((Racun)entity).SifraRacuna.ToString(), "sifraRacuna").Cast<StavkaRacuna>().ToList();
            }

            foreach(IEntity entity in result)
            {
                foreach(StavkaRacuna stavka in ((Racun)entity).StavkeRacuna)
                {
                    stavka.Racun = (Racun)entity;
                }
            }
        }
    }
}
