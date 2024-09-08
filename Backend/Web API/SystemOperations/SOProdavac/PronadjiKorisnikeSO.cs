using Common;
using Common.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.SystemOperations.SOProdavac
{
    internal class PronadjiKorisnikeSO : SystemOperationBase
    {
        private string[] vrednosti;
        public List<IEntity> Result { get; set; }

        public PronadjiKorisnikeSO(string[] vrednosti)
        {
            this.vrednosti = vrednosti;
        }

        public override void ExecuteConcreteOperation()
        {
            Result = broker.GetAllByFilter(new Korisnik(), vrednosti[0], vrednosti[1]);
        }
    }
}
