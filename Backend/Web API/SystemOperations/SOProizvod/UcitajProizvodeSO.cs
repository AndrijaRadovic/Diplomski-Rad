using Common;
using Common.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.SystemOperations.SOProizvod
{
    internal class UcitajProizvodeSO : SystemOperationBase
    {
        public List<IEntity> result = new List<IEntity>();
        public override void ExecuteConcreteOperation()
        {
            result = broker.GetAll(new Proizvod());
        }
    }
}
