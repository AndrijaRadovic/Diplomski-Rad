using Common.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.SystemOperations.SOProdavac
{
    internal class IzmeniKorisnikaSO : SystemOperationBase
    {
        private Korisnik korisnik;

        public IzmeniKorisnikaSO(Korisnik korisnik)
        {
            this.korisnik = korisnik;
        }

        public override void ExecuteConcreteOperation()
        {
            broker.Update(korisnik);
        }
    }
}
