using Common.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.SystemOperations.SOProdavac
{
    internal class ObrisiProdavcaSO : SystemOperationBase
    {
        private Korisnik korisnik;

        public ObrisiProdavcaSO(Korisnik izabraniKorisnik)
        {
            this.korisnik = izabraniKorisnik;
        }

        public override void ExecuteConcreteOperation()
        {
            broker.Delete(korisnik);
        }
    }
}
