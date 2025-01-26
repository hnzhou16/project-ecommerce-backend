import { Request, Response } from "express";
import { generatePrompt, getAIResponse } from "../helper/OpenAIPrompt";
import * as fs from "fs";
import * as path from "path";
import {fileURLToPath} from "url";

export class OpenAIController {
  static async getRecommendations(req: Request, res: Response) {
    const userInput = req.body.input;

    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)
    const bodyTemplatePath = path.join(__dirname, "../helper/filterBody.json");
    const bodyTemplate = JSON.parse(fs.readFileSync(bodyTemplatePath, "utf8"));

    function processAIResponse(aiResponse: string) {
      const processedResponse: Record<string, string[]> = {};

      // aiResponse example
      // - Gender: Women
      // - Category:
      // - Size:
      // - Color: Red
      // - Fabric
      const lines = aiResponse
        .trim()
        .split("\n")
        .filter((line) => line.trim());

      // processedResponse example = {
      // '- Gender': [ 'Women' ],
      // '- Color': [ 'Red' ]
      // }
      lines.forEach((line) => {
        const [key, value] = line.split(":").map((str) => str.trim());
        if (value) {
          processedResponse[key] = value.split(",").map((item) => item.trim());
        }
      });

      return processedResponse;
    }

    function generateSearchBody(template, aiResponse) {
      if (typeof aiResponse !== "object" || aiResponse === null) {
        throw new Error("Invalid AI response format");
      }

      for (const [category, values] of Object.entries(aiResponse)) {
        const key = category.replace("- ", "").trim(); // Remove the '- ' prefix and trim whitespace

        if (template[key]) {
          template[key].forEach((item) => {
            // For the 'Colour' category, compare with the 'alt' property
            if (key === "Color") {
              if (Array.isArray(values) && values.includes(item.swatch.colorGroup_name)) {
                item.isChecked = true;
              }
            } else {
              if (Array.isArray(values) && values.includes(item.name)) {
                item.isChecked = true;
              }
            }
          });
        }
      }

      return template;
    }

    try {
      const prompt = generatePrompt(userInput);
      const aiResponse = await getAIResponse(prompt);
      const extractedData = processAIResponse(aiResponse);

      const searchBody = generateSearchBody(bodyTemplate, extractedData);

      res.json({ success: true, data: searchBody });
    } catch (error) {
      console.error("Error getting recommendations:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to get recommendations." });
    }
  }
}