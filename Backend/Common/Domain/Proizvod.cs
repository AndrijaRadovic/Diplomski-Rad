using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Domain
{
    [Serializable]
    public class Proizvod : IEntity
    {
        public int SifraProizvoda { get; set; }
        public string NazivProizvoda { get; set; }
        public double Cena { get; set; }
        public string TableName => "Proizvod";
        public TipProizvoda TipProizvoda { get; set; }
        public string PrimaryKey => "sifraProizvoda";

        public virtual string AddColumn()
        {
            return ", CASE WHEN Alat.sifraProizvoda IS NOT NULL THEN 'Alat' WHEN Plocice.sifraProizvoda IS NOT NULL THEN 'Plocice' WHEN Farba.sifraProizvoda IS NOT NULL THEN 'Farba' ELSE 'Proizvod' END AS TableName ";
        }

        public string GetByIdQuery(string use = "")
        {
            if (use == "specijalizacija")
                return $"Proizvod.sifraProizvoda = {SifraProizvoda}";

            return $"sifraProizvoda = {SifraProizvoda}";
        }

        public string GetFilterQuery(string filter, string field = "")
        {
            return $"lower(nazivProizvoda) like concat('%',lower('{filter}'),'%')";
        }

        public virtual string GetParameters(string use = "")
        {
            return "@nazivProizvoda, @cena";
        }

        public List<IEntity> GetReaderList(SqlDataReader reader)
        {
            throw new NotImplementedException();
        }

        public IEntity GetReaderResult(SqlDataReader reader)
        {
            if (reader.Read())
            {
                string tipProizvoda = (string)reader["TableName"];

                if (tipProizvoda == "Alat")
                {
                    Alat alat = new Alat
                    {
                        SifraProizvoda = (int)reader["sifraProizvoda"],
                        NazivProizvoda = (string)reader["nazivProizvoda"],
                        Cena = (double)reader["cena"],
                        TipAlata = (TipAlata)Enum.Parse(typeof(TipAlata), (string)reader["tipAlata"]),
                        TipProizvoda = TipProizvoda.Alat
                    };
                    return alat;
                }

                if(tipProizvoda == "Farba")
                {
                    Farba farba = new Farba
                    {
                        SifraProizvoda = (int)reader["sifraProizvoda"],
                        NazivProizvoda = (string)reader["nazivProizvoda"],
                        Cena = (double)reader["cena"],
                        TipProizvoda = TipProizvoda.Farba,
                        Boja = (string)reader["boja"],
                        VelicinaPakovanja = (double)reader["velicinaPakovanja"]
                    };
                    return farba;
                }

                if(tipProizvoda == "Plocice")
                {
                    Plocice plocice = new Plocice
                    {
                        SifraProizvoda = (int)reader["sifraProizvoda"],
                        NazivProizvoda = (string)reader["nazivProizvoda"],
                        Cena = (double)reader["cena"],
                        TipProizvoda = TipProizvoda.Plocice,
                        Materijal = (string)reader["materijal"],
                        Sirina = (double)reader["sirina"],
                        Duzina = (double)reader["duzina"]
                    };
                    return plocice;
                }
            }

            return null;
        }

        public virtual string GetSearchAttributes()
        {
            return "*";

            //throw new NotImplementedException();
        }

        public virtual string GetTableName(string use = "")
        {
            return TableName;
        }

        public virtual string JoinQuery()
        {
            return " left join Alat on Proizvod.sifraProizvoda = Alat.sifraProizvoda left join Farba on Proizvod.sifraProizvoda = Farba.sifraProizvoda left join Plocice on Proizvod.sifraProizvoda = Plocice.sifraProizvoda ";
        }

        public string LoginQuery()
        {
            throw new NotImplementedException();
        }

        public virtual void PrepareCommand(SqlCommand command, string use = "")
        {
            command.Parameters.AddWithValue("@nazivProizvoda", NazivProizvoda);
            command.Parameters.AddWithValue("@cena", Cena);
        }

        public virtual List<IEntity> ReadAllSearch(SqlDataReader reader)
        {
            List<IEntity> proizvodi = new List<IEntity>();
            while (reader.Read())
            {
                string tipProizvoda = (string)reader["TableName"];

                if (tipProizvoda == "Alat")
                {
                    Alat alat = new Alat
                    {
                        SifraProizvoda = (int)reader["sifraProizvoda"],
                        NazivProizvoda = (string)reader["nazivProizvoda"],
                        Cena = (double)reader["cena"],
                        TipAlata = (TipAlata)Enum.Parse(typeof(TipAlata), (string)reader["tipAlata"]),
                        TipProizvoda = TipProizvoda.Alat
                    };
                    proizvodi.Add(alat);
                }

                if (tipProizvoda == "Farba")
                {
                    Farba farba = new Farba
                    {
                        SifraProizvoda = (int)reader["sifraProizvoda"],
                        NazivProizvoda = (string)reader["nazivProizvoda"],
                        Cena = (double)reader["cena"],
                        TipProizvoda = TipProizvoda.Farba,
                        Boja = (string)reader["boja"],
                        VelicinaPakovanja = (double)reader["velicinaPakovanja"]
                    };
                    proizvodi.Add(farba);
                }

                if (tipProizvoda == "Plocice")
                {
                    Plocice plocice = new Plocice
                    {
                        SifraProizvoda = (int)reader["sifraProizvoda"],
                        NazivProizvoda = (string)reader["nazivProizvoda"],
                        Cena = (double)reader["cena"],
                        TipProizvoda = TipProizvoda.Plocice,
                        Materijal = (string)reader["materijal"],
                        Sirina = (double)reader["sirina"],
                        Duzina = (double)reader["duzina"]
                    };
                    proizvodi.Add(plocice);
                }
            }

            return proizvodi;
        }

        public virtual string UpdateQuery(string field = "")
        {
            return $"nazivProizvoda = '{NazivProizvoda}', cena = {Cena}";
        }

        public override string ToString()
        {
            return NazivProizvoda;
        }

        public string OrderByQuery()
        {
            return "";
        }
    }
}
