import process from "node:process";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { Effect } from "effect";

export class ModelProvider extends Effect.Service<ModelProvider>()(
  "Provider/Model",
  {
    effect: Effect.gen(function* () {
      const google = createGoogleGenerativeAI({
        apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
      });

      const gemini = {
        "2.5-flash": google("gemini-2.5-flash"),
        // "2.5-pro": google("gemini-2.5-pro"),
      };

      return {
        gemini,
      };
    }),
  }
) {}
