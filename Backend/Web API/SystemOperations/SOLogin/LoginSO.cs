using Common;
using Common.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.SystemOperations.SOLogin
{
    internal class LoginSO : SystemOperationBase
    {
        public IEntity result { get; set; }
        private Korisnik korisnik;

        public LoginSO(Korisnik korisnik)
        {
            this.korisnik = korisnik;
        }

        public override void ExecuteConcreteOperation()
        {
            result = (Korisnik)broker.GetEntityById(korisnik, "login");
        }
    }
}
