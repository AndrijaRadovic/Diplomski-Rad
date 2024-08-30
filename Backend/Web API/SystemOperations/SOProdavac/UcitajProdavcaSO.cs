using Common.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.SystemOperations.SOProdavac
{
    internal class UcitajProdavcaSO : SystemOperationBase
    {
        private int id;

        public UcitajProdavcaSO(int id)
        {
            this.id = id;
        }

        public Korisnik Result { get; internal set; }

        public override void ExecuteConcreteOperation()
        {
            Result = (Korisnik)broker.GetEntityById(new Korisnik() { SifraKorisnika = id });
        }
    }
}
