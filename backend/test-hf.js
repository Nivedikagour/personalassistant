import { HfInference } from '@huggingface/inference';
const hfToken = "your_token_here";
const hf = new HfInference(hfToken);

async function test() {
  try {
    const out = await hf.chatCompletion({
      model: "Qwen/Qwen2.5-72B-Instruct",
      messages: [{ role: "user", content: "Hello" }],
      max_tokens: 50,
    });
    console.log("SUCCESS:", out.choices[0].message.content);
  } catch (error) {
    console.error("ERROR:");
    console.error(error.httpResponse?.body?.error || error);
  }
}
test();
