using Common.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.SystemOperations.SOProdavac
{
    internal class ProveriUsernameSO : SystemOperationBase
    {
        private string username;

        public ProveriUsernameSO(string username)
        {
            this.username = username;
        }

        public Korisnik Result { get; internal set; }

        public override void ExecuteConcreteOperation()
        {
            Result = (Korisnik)broker.GetEntityById(new Korisnik { Username = username }, "username");
        }
    }
}
