import { ApiHandler } from "sst/node/api";

const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function getGroqChatCompletion() {
  return groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: "Explain the importance of fast language models",
      },
    ],
    model: "llama3-8b-8192",
  });
}

export const post = ApiHandler(async (_evt) => {
  const chatCompletion = await getGroqChatCompletion();
  const output = chatCompletion.choices[0]?.message?.content || "";

  // Print the completion returned by the LLM.
  process.stdout.write(output);

  return {
    statusCode: 200,
    body: JSON.stringify({
      content: output,
    }),
  };
});
