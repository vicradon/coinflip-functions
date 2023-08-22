import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import getDbContainer from "../utils/getDBContainer";

export async function JoinGameSession(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);

  const requestBody = await request.json();
  const gamecode = requestBody["gamecode"];
  const player2Username = requestBody["player2Username"];

  const dbContainer = await getDbContainer("coin-flip-sessions");

  const { resources: gameSessions } = await dbContainer.items
    .query(`SELECT * from c WHERE c.gamecode='${gamecode}'`)
    .fetchAll();

  const gameSession = gameSessions[0];

  gameSession["player2Username"] = player2Username;

  const { resource: updatedGameSession } = await dbContainer
    .item(gameSession.id)
    .replace(gameSession);

  return {
    jsonBody: {
      id: gameSession.id,
      gameSession: updatedGameSession,
      message: "Joined game session",
    },
  };
}

app.http("JoinGameSession", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: JoinGameSession,
});
