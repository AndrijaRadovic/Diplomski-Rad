using Common.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.SystemOperations.SOProizvod
{
    internal class ObrisiProizvodSO : SystemOperationBase
    {
        private Proizvod izabraniProizvod;

        public ObrisiProizvodSO(Proizvod izabraniProizvod)
        {
            this.izabraniProizvod = izabraniProizvod;
        }

        public override void ExecuteConcreteOperation()
        {
            broker.Delete(izabraniProizvod);
            broker.Delete(izabraniProizvod, "parent");
        }
    }
}
