import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import getDbContainer from "../utils/getDBContainer";

export async function FetchGameSession(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);
  const requestBody = await request.json();
  const dbContainer = await getDbContainer("coin-flip-sessions");

  const { resources } = await dbContainer.items
    .query(`SELECT * FROM c WHERE c.gamecode='${requestBody["gamecode"]}'`)
    .fetchAll();

  const game = resources[0];

  return {
    jsonBody: {
      message: "Fetched game session",
      game,
    },
  };
}

app.http("FetchGameSession", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  handler: FetchGameSession,
});
