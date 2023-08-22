import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import getDbContainer from "../utils/getDBContainer";
import { generateCustomUuid } from "custom-uuid";

export async function CreateGameSession(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);

  const requestBody = await request.json();
  const gamecode = generateCustomUuid("abcdef12345", 5);

  const dbContainer = await getDbContainer("coin-flip-sessions");
  await dbContainer.items.create({
    gamecode,
    player1Username: requestBody["player1Username"],
    flip_reason: requestBody["flip_reason"],
  });

  return {
    jsonBody: {
      message: "Created game session",
      gamecode,
    },
  };
}

app.http("CreateGameSession", {
  methods: ["POST"],
  authLevel: "anonymous",
  extraOutputs: [],
  handler: CreateGameSession,
});
