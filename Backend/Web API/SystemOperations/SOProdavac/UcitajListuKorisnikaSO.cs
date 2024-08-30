using Common;
using Common.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.SystemOperations.SORacun
{
    internal class UcitajListuKorisnikaSO : SystemOperationBase
    {
        public List<IEntity> result { get; set; }
        public override void ExecuteConcreteOperation()
        {
            result = broker.GetAll(new Korisnik());
        }
    }
}
