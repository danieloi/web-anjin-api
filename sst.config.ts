import { SSTConfig } from "sst";
import { API } from "./stacks/LlamaHackathonApiStack";

export default {
  config(_input) {
    return {
      name: "web-anjin-api",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(API);
  },
} satisfies SSTConfig;
