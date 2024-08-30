using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;

namespace Common.Domain
{
    [Serializable]
    public class Korisnik : IEntity
    {
        public int SifraKorisnika { get; set; }
        public string Ime { get; set; }
        public string Prezime { get; set; }
        public Pol Pol { get; set; }
        public Uloga Uloga { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Jmbg { get; set; }
        public string Email { get; set; }
        public string BrojTelefona { get; set; }
        public string Token { get; set; }
        public string TableName => "Korisnik";
        public string PrimaryKey => "sifraKorisnika";

        public string GetFilterQuery(string filter, string field = "")
        {
            if (field == "ime")
                return $"lower(ime) like concat('%',lower('{filter}'),'%')";

            if (field == "prezime")
                return $"lower(prezime) like concat('%',lower('{filter}'),'%')";

            return $"(lower(ime) like concat('%',lower('{filter}'),'%')) OR (lower(prezime) like concat('%',lower('{filter}'),'%'))";
        }

        public string GetParameters(string use = "")
        {
            return "@ime, @prezime, @pol, @uloga, @username, @password, @jmbg, @email, @brojTelefona";
        }

        public List<IEntity> GetReaderList(SqlDataReader reader)
        {
            throw new NotImplementedException();
        }

        public IEntity GetReaderResult(SqlDataReader reader)
        {
            if (reader.Read())
            {
                Korisnik korisnik = new Korisnik()
                {
                    SifraKorisnika = (int)reader["sifraKorisnika"],
                    Ime = (string)reader["ime"],
                    Prezime = (string)reader["prezime"],
                    Pol = (Pol)Enum.Parse(typeof(Pol), (string)reader["pol"]),
                    Uloga = (Uloga)Enum.Parse(typeof(Uloga), (string)reader["uloga"]),
                    Username = (string)reader["username"],
                    Password = (string)reader["password"],
                    Jmbg = (string)reader["jmbg"],
                    Email = (string)reader["email"],
                    BrojTelefona = (string)reader["brojTelefona"]
                };
                return korisnik;
            }
            return null;
        }

        public string GetSearchAttributes()
        {
            return "sifraKorisnika, ime, prezime, uloga, email, brojTelefona";
        }

        public string JoinQuery()
        {
            return "";
        }

        public void PrepareCommand(SqlCommand command, string use = "")
        {
            command.Parameters.AddWithValue("@ime", Ime);
            command.Parameters.AddWithValue("@prezime", Prezime);
            command.Parameters.AddWithValue("@pol", Pol.ToString());
            command.Parameters.AddWithValue("@uloga", Uloga.ToString());
            command.Parameters.AddWithValue("@username", Username);
            command.Parameters.AddWithValue("@password", Password);
            command.Parameters.AddWithValue("@jmbg", Jmbg);
            command.Parameters.AddWithValue("@email", Email);
            command.Parameters.AddWithValue("@brojTelefona", BrojTelefona);
        }

        public List<IEntity> ReadAllSearch(SqlDataReader reader)
        {
            List<IEntity> entities = new List<IEntity>();
            while (reader.Read())
            {
                Korisnik korisnik = new Korisnik
                {
                    SifraKorisnika = (int)reader["sifraKorisnika"],
                    Ime = (string)reader["ime"],
                    Prezime = (string)reader["prezime"],
                    Uloga = (Uloga)Enum.Parse(typeof(Uloga), (string)reader["uloga"]),
                    Email = (string)reader["email"],
                    BrojTelefona = (string)reader["brojTelefona"]
                };
                entities.Add(korisnik);
            }
            return entities;
        }

        public string UpdateQuery(string field = "")
        {
            if (field == "sifra")
                return $"password = '{Password}'";

            return $"ime = '{Ime}', prezime = '{Prezime}', username = '{Username}', email = '{Email}', brojTelefona = '{BrojTelefona}'";
        }

        public string GetByIdQuery(string use = "")
        {
            if (use == "login")
                return $"username = '{Username}' and password = '{Password}'";

            if (use == "username")
                return $"username = '{Username}'";

            return $"sifraKorisnika = {SifraKorisnika}";
        }

        public string GetTableName(string use = "")
        {
            return TableName;
        }

        public string AddColumn()
        {
            return "";
        }

        public string OrderByQuery()
        {
            return "";
        }
    }
}
