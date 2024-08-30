using Common.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.SystemOperations.SORacun
{
    internal class KreirajProdavcaSO : SystemOperationBase
    {
        private Korisnik korisnik;

        public KreirajProdavcaSO(Korisnik korisnik)
        {
            this.korisnik = korisnik;
        }

        public override void ExecuteConcreteOperation()
        {
            broker.Add(korisnik);
        }
    }
}
