using Common;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DBBroker
{
    public class Broker
    {
        DBConnection connection;
        public Broker()
        {
            connection = new DBConnection();
        }

        public void BeginTransaction()
        {
            connection.BeginTransaction();
        }

        public void CloseConnection()
        {
            connection.CloseConnection();
        }

        public void Commit()
        {
            connection.Commit();
        }
        public void Add(IEntity entity, string use = "")
        {
            SqlCommand command = connection.CreateCommand();
            command.CommandText = $"insert into {entity.GetTableName(use)} values({entity.GetParameters(use)})";
            entity.PrepareCommand(command, use);
            command.ExecuteNonQuery();
            command.Dispose();
        }
        public List<IEntity> GetAllByFilter(IEntity entity, string filter, string field = "")
        {
            SqlCommand cmd = connection.CreateCommand();
            cmd.CommandText = $"Select {entity.GetSearchAttributes()} from {entity.GetTableName()} {entity.JoinQuery()} where {entity.GetFilterQuery(filter, field)} {entity.OrderByQuery()}";
            SqlDataReader reader = cmd.ExecuteReader();
            List<IEntity> entities = entity.ReadAllSearch(reader);
            reader.Close();
            cmd.Dispose();
            return entities;
        }

        public IEntity GetEntityById(IEntity entity, string use = "")
        {
            SqlCommand cmd = connection.CreateCommand();
            cmd.CommandText = $"select * {entity.AddColumn()} from {entity.TableName} {entity.JoinQuery()} where {entity.GetByIdQuery(use)}";
            SqlDataReader reader = cmd.ExecuteReader();
            entity = entity.GetReaderResult(reader);
            reader.Close();
            cmd.Dispose();
            return entity;
        }

        public void Delete(IEntity entity, string use = "")
        {
            SqlCommand cmd = connection.CreateCommand();
            cmd.CommandText = $"Delete from {entity.GetTableName(use)} where {entity.GetByIdQuery(use)}";
            cmd.ExecuteNonQuery();
            cmd.Dispose();
        }

        public void OpenConnection()
        {
            connection.OpenConnection();
        }

        public void Rollback()
        {
            connection.Rollback();
        }

        public void Update(IEntity entity, string field = "")
        {
            SqlCommand cmd = connection.CreateCommand();
            cmd.CommandText = $"Update {entity.GetTableName(field)} set {entity.UpdateQuery(field)} where {entity.GetByIdQuery()}";
            cmd.ExecuteNonQuery();
            cmd.Dispose();
        }

        public List<IEntity> GetAll(IEntity entity)
        {
            SqlCommand cmd = connection.CreateCommand();
            cmd.CommandText = $"Select {entity.GetSearchAttributes()} {entity.AddColumn()} from {entity.GetTableName()} {entity.JoinQuery()} {entity.OrderByQuery()}";
            SqlDataReader reader = cmd.ExecuteReader();
            List<IEntity> entities = entity.ReadAllSearch(reader);
            reader.Close();
            cmd.Dispose();
            return entities;
        }

        public int AddWithId(IEntity entity, string use = "")
        {
            SqlCommand cmd = connection.CreateCommand();
            cmd.CommandText = $"Insert into {entity.GetTableName(use)} output inserted.{entity.PrimaryKey} values ({entity.GetParameters(use)})";
            entity.PrepareCommand(cmd, use);
            int id = (int)cmd.ExecuteScalar();
            cmd.Dispose();
            return id;
        }
    }
}
