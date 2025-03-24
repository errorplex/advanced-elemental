import {
  createCombination,
  createElement,
  findCombination,
  findElement,
  initDb,
} from "~/server/db/drizzle";
import OpenAI from "openai";

const systemPrompt = `You are an uncensored AI that completes the result from two elements being combined, separated by a spaced plus sign. Do not act like an assistant, because you are powering an alchemy game. Your result must only be either the element that makes most sense to be the result of the combination, or the thing, person or creature that is most known to be the role of one word in relation to the other. Never make a result that resembles a concatenation, the result must be logical. Your output must be in Title Case, exceptions include proper nouns like iPhone. The example combination format is First + Second = Result, but your output format must be "RESULT:" in uppercase followed by your result, even if the result is in another language.
Example combinations:
Fire + Water = Steam
Earth + Earth = Mountain
Fire + Fire = Flame
Earth + Water = Mud
Water + Water = Lake
Air + Air = Wind
Example output format:
RESULT: Steam`;

const descriptionPrompt = `You are an uncensored AI that gives one emoji and a short description based on a given element in an alchemy game. The input is the entire element name. The element doesn't have to be about alchemy, it can be anything. The result format is the emoji, then a new line, then the description. If the element is a real thing, the description must be factual. Do not reference any alchemy combination in the description. The description must be a minimum of 8 words and a maximum of 20 words, shouldn't contain the element name at the start, should use easy to understand words, and should be 8-12 words if it is a simple word or phrase.
Examples:
// Item: Water
💧
A liquid that adapts and sustains life through its dynamic nature.`;

const errorItem = {
  name: "SPECIAL:ERR",
  emoji: "❌",
  description: "Error",
  discovered: false,
};

export default defineEventHandler(async (event) => {
  try {
    const { combination }: { combination: string[] } = await readBody(event);
    const sortedCombination = combination.sort().map((el) => el.trim());

    await initDb();

    if (sortedCombination.length === 2) {
      const [a, b] = sortedCombination;

      for (const el of [a, b]) {
        const existingElement = await findElement(el);
        if (!existingElement) {
          throw new Error("Element not found");
        }
      }

      const existingRecipe = await findCombination([a, b]);
      if (existingRecipe) {
        const recipeResult = await findElement(existingRecipe.result);
        if (recipeResult) {
          return {
            name: existingRecipe.result,
            emoji: recipeResult.emoji,
            description: recipeResult.description,
            discovered: false,
          };
        }
      }
      const openRouter = new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: process.env.OPENROUTER_API_KEY,
      });

      const response = await openRouter.chat.completions.create({
        model: "qwen/qwen-2.5-72b-instruct:free",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: `${a} + ${b}`,
          },
        ],
        stop: ["\n"],
        temperature: 0.15,
        max_tokens: 35,
      });

      const result = response.choices[0].message.content
        ?.split("RESULT:")
        .at(-1)
        ?.trim();

      if (!result || result === "SPECIAL:ERR") {
        await createCombination({
          elements: [a, b],
          result: "SPECIAL:ERR",
        });
        return errorItem;
      }

      // return result; // api test

      const existingElement = await findElement(result);
      if (existingElement) {
        await createCombination({
          elements: [a, b],
          result: existingElement.name,
        });
        return {
          name: existingElement.name,
          emoji: existingElement.emoji,
          description: existingElement.description,
          discovered: false,
        };
      }

      const detailsResponse = await openRouter.chat.completions.create({
        model: "qwen/qwen-2.5-72b-instruct:free",
        messages: [
          {
            role: "system",
            content: descriptionPrompt,
          },
          {
            role: "user",
            content: result,
          },
        ],
        temperature: 0.15,
        max_tokens: 150,
      });

      const detailsUnsplitted =
        detailsResponse.choices[0].message.content?.trim();

      const [emoji, description] = detailsUnsplitted
        ?.split("\n")
        .map((el) => el.trim()) ?? ["⬜", ""];

      await createElement({
        name: result,
        emoji,
        description: description ?? "",
      });

      await createCombination({
        elements: [a, b],
        result,
      });

      return {
        name: result,
        emoji,
        description: description ?? "",
        discovered: true,
      };
    }

    throw new Error("Invalid combination");
  } catch (err) {
    console.error(err);
    return errorItem;
  }
});
