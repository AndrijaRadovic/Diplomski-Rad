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
        private string filter;
        public List<IEntity> Result { get; set; }

        public PronadjiKorisnikeSO(string filter)
        {
            this.filter = filter;
        }

        public override void ExecuteConcreteOperation()
        {
            Result = broker.GetAllByFilter(new Korisnik(), filter);
        }
    }
}
