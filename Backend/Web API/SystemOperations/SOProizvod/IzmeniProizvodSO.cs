using Common.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.SystemOperations.SOProizvod
{
    internal class IzmeniProizvodSO : SystemOperationBase
    {
        private Proizvod proizvod;

        public IzmeniProizvodSO(Proizvod proizvod)
        {
            this.proizvod = proizvod;
        }

        public override void ExecuteConcreteOperation()
        {
            broker.Update(proizvod, "parent");
            broker.Update(proizvod);
        }
    }
}
