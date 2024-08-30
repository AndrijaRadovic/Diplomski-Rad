using Common.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.SystemOperations.SOProdavac
{
    internal class PromeniSifruSO : SystemOperationBase
    {
        private Korisnik prijavljeniKorisnik;

        public PromeniSifruSO(Korisnik prijavljeniKorisnik)
        {
            this.prijavljeniKorisnik = prijavljeniKorisnik;
        }

        public override void ExecuteConcreteOperation()
        {
            broker.Update(prijavljeniKorisnik, "sifra");
        }
    }
}
