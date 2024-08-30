using Common.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.SystemOperations.SOProizvod
{
    internal class KreirajProizvodSO : SystemOperationBase
    {
        private Proizvod proizvod;

        public KreirajProizvodSO(Proizvod proizvod)
        {
            this.proizvod = proizvod;
        }

        public override void ExecuteConcreteOperation()
        {
            proizvod.SifraProizvoda = broker.AddWithId(proizvod, "parent");
            broker.Add(proizvod);
        }
    }
}
