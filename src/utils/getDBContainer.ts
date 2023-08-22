import { CosmosClient } from "@azure/cosmos";

export default async function getDbContainer(containerId: string) {
  const client = new CosmosClient({
    endpoint: process.env.CosmosEndpoint,
    key: process.env.CosmosKey,
  });

  const database = client.database("coin-flip-db");
  const container = database.container(containerId);
  return container;
}
