import "dotenv/config";
import { StackContext, Api } from "sst/constructs";

export function API({ stack }: StackContext) {
  const api = new Api(stack, "api", {
    defaults: {
      function: {
        environment: {
          GROQ_API_KEY: process.env.GROQ_API_KEY || "",
        },
      },
    },
    routes: {
      "POST /smarter-page-search":
        "packages/functions/src/smarter-page-search.post",
      "POST /point-and-ask": "packages/functions/src/point-and-ask.post",
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
