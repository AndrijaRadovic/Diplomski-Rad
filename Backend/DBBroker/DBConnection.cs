using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DBBroker
{
    internal class DBConnection
    {
        SqlConnection connection;
        SqlTransaction transaction;
        //private IConfiguration configuration;

        public DBConnection()
        {
            //this.connection = new SqlConnection(configuration.GetConnectionString("database"));
            this.connection = new SqlConnection(ConfigurationManager.ConnectionStrings["database"].ConnectionString);
        }

        internal void BeginTransaction()
        {
            transaction = this.connection.BeginTransaction();
        }

        internal void CloseConnection()
        {
            transaction?.Dispose();
            connection?.Close();
        }

        internal void Commit()
        {
            transaction?.Commit();
        }


        internal void OpenConnection()
        {
            connection?.Open();
        }

        internal void Rollback()
        {
            transaction?.Rollback();
        }
        internal SqlCommand CreateCommand()
        {
            return new SqlCommand("", connection, transaction);
        }
    }
}
