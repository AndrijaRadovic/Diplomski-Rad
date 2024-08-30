using Common.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.SystemOperations.SOProizvod
{
    internal class UcitajProizvodSO : SystemOperationBase
    {
        private int id;
        public Proizvod Result { get; set; }

        public UcitajProizvodSO(int id)
        {
            this.id = id;
        }

        public override void ExecuteConcreteOperation()
        {
            Result = (Proizvod)broker.GetEntityById(new Proizvod { SifraProizvoda = id }, "specijalizacija");
        }
    }
}
