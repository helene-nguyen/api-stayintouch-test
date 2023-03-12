interface CoreDataMapper {
  client: Client;
}
interface Client {
  query(preparedQuery: { text: string; values?: number[] | string [] }): { rows: string[] };
}

class CoreDataMapper {
  constructor(client: Client) {
    this.client = client;
  }
}

export { CoreDataMapper };
