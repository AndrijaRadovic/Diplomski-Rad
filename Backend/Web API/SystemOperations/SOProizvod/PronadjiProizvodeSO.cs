using Common;
using Common.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.SystemOperations.SOProizvod
{
    internal class PronadjiProizvodeSO : SystemOperationBase
    {
        private string naziv;
        public List<IEntity> Result { get; set; }

        public PronadjiProizvodeSO(string naziv)
        {
            this.naziv = naziv;
        }

        public override void ExecuteConcreteOperation()
        {
            Result = broker.GetAllByFilter(new Alat(), naziv);
            Result.AddRange(broker.GetAllByFilter(new Farba(), naziv));
            Result.AddRange(broker.GetAllByFilter(new Plocice(), naziv));
        }
    }
}
