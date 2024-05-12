import { ApiHandler } from "sst/node/api";

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
          "You are my browser pilot that helps me find the best answer to my question.",
      },
      {
        role: "user",
        content: `Using ${siteText}, answer the following question: ${query}`,
      },
    ],
    model: "llama3-8b-8192",
  });
}

export const post = ApiHandler(async (_evt) => {
  const query = _evt.queryStringParameters?.query;
  const siteText = _evt.queryStringParameters?.siteText;
  if (!query || !siteText) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "query and siteText parameters are required",
      }),
    };
  }
  const chatCompletion = await getGroqChatCompletion(siteText, query);
  // Print the completion returned by the LLM.
  const output = chatCompletion.choices[0]?.message?.content || "";

  return {
    statusCode: 200,
    body: JSON.stringify({
      content: output,
    }),
  };
});
