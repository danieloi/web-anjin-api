import { ApiHandler } from "sst/node/api";

interface EventBody {
  query: string;
  siteText: string;
}

const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function getGroqChatCompletion(siteText: string, query: string) {
  return groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are my browser pilot that helps me find the best answer to questions I have about content on a website.",
      },
      {
        role: "user",
        content: `Using the following text from the website I'm looking at up to <END>: ${siteText} <END>, fulfill the following request: ${query}`,
      },
    ],
    model: process.env.MODEL_NAME,
  });
}

export const post = ApiHandler(async (_evt) => {
  if (!_evt.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Request body is missing" }),
    };
  }

  const { query, siteText } = JSON.parse(_evt.body) as EventBody;

  const chatCompletion = await getGroqChatCompletion(siteText, query);

  const output = chatCompletion.choices[0]?.message?.content || "";

  return {
    statusCode: 200,
    body: JSON.stringify({
      content: output,
    }),
  };
});
