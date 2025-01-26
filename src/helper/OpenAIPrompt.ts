import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  await import('dotenv-flow').then((dotenv) => dotenv.config());
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Filters and prompt template
const filters = {
  gender: ["Men", "Women"],
  category: [
    "Coats & Jackets",
    "Dresses & Skirts",
    "Hoodies & Sweatshirts",
    "Shirts",
    "Shorts",
    "Sweaters",
    "T-Shirts",
    "Pants",
    "Accessories"
  ],
  size: [
    "0",
    "2",
    "4",
    "6",
    "8",
    "10",
    "12",
    "14",
    "16",
    "XXS",
    "XS",
    "S",
    "XS/S",
    "M",
    "L",
    "M/L",
    "XL",
    "XXL",
    "XL/XXL",
    "ONE SIZE",
  ],
  color: [
    "Black",
    "White",
    "Gray",
    "Khaki",
    "Yellow",
    "Purple",
    "Pink",
    "Red",
    "Green",
    "Blue",
  ],
  fabric: [
    "Cotton",
    "Liner",
    "Wool",
    "Cotton Blend",
    "Liner Blend",
    "Wool Blend",
    "Semi-Synthetic"
  ],
};

const promptTemplate = `
Given the following categories and options, extract the relevant keywords from the user's input. 
Your answer should only include the categories and values that are defined in the provided lists and are relevant to user inputs.
- For sizes, include slightly more options but keep all suggestions realistic.
- If any of the categories in the answer has no value, do not include it.

Categories:
- Gender: ${filters.gender.join(", ")}
- Category: ${filters.category.join(", ")}
- Size: ${filters.size.join(", ")}
- Color: ${filters.color.join(", ")}
- Fabric: ${filters.fabric.join(", ")}

User Input: "{{userInput}}"

Extracted Keywords:
- Gender: 
- Category:
- Size:
- Color:
- Fabric:
`;

export function generatePrompt(userInput: string) {
  return promptTemplate.replace("{{userInput}}", userInput);
}

// Function to send a request to OpenAI
export async function getAIResponse(prompt: string) {
  // console.log("Received response:", prompt);
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    return response.choices[0]?.message?.content;
  } catch (error) {
    console.error("Error generating AI response:", error);
    throw new Error("Failed to generate AI response.");
  }
}