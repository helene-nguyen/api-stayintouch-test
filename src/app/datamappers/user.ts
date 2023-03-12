//~ Import modules
import pg from 'pg';
import client from '../database/connexion.js';
import { CoreDataMapper } from './coreDataMapper.js';

class UserDataMapper extends CoreDataMapper {
  tableName = 'user';
  columns = `"id","last_name","first_name"`;
  oneUserFunction = 'user_identity';
  allUsersFunction = 'find_all_users';
  nearbyUsersFunction = 'find_users_by_radius';

  //   Default display all users but you can add limit and offset values
  async findAll(limit: number | null, offset: number | undefined): Promise<string[] | undefined> {
    if (this.client instanceof pg.Pool) {
      const preparedQuery = {
        text: `
                SELECT ${this.columns}
                FROM ${this.allUsersFunction}($1,$2);`,
        values: [limit, offset],
      };

      const result = await this.client.query(preparedQuery);
      return result.rows;
    }
  }

  async findOne(firstName: string) {
    if (this.client instanceof pg.Pool) {
      const preparedQuery = {
        text: `
                SELECT *
                FROM "${this.oneUserFunction}"($1);`,
        values: [firstName],
      };

      const result = await this.client.query(preparedQuery);

      return result.rows[0];
    }
  }

  async findAllNearbyUsers(userId: number, radius: number) {
    if (this.client instanceof pg.Pool) {
      const preparedQuery = {
        text: `
                SELECT *
                FROM "${this.nearbyUsersFunction}"($1,$2);`,
        values: [userId, radius],
      };

      const result = await this.client.query(preparedQuery);
      return result.rows;
    }
  }
}

const User = new UserDataMapper(client);
export { User };
