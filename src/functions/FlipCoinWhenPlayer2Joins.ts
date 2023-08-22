import { app, InvocationContext } from "@azure/functions";
import getDbContainer from "../utils/getDBContainer";

const coinFlipIsHeads = () => {
  const randomNumber = Math.random();

  if (randomNumber > 0.5) {
    return true;
  }
  return false;
};

export async function FlipCoinWhenPlayer2Joins(
  documents: unknown[],
  context: InvocationContext
): Promise<void> {
  context.log(`Cosmos DB function processed ${documents.length} documents`);

  const dbContainer = await getDbContainer("coin-flip-sessions");

  for (let doc of documents) {
    if (doc["player2Username"]) {
      // flip coin here

      doc["winner"] = coinFlipIsHeads ? "player1" : "player2";

      await dbContainer.item(doc["id"]).replace(doc);
    }
  }
}

app.cosmosDB("FlipCoinWhenPlayer2Joins", {
  connection: "CosmosDBConnection",
  databaseName: "coin-flip-db",
  containerName: "coin-flip-sessions",
  handler: FlipCoinWhenPlayer2Joins,
});
