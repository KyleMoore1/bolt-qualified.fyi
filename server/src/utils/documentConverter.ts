import mammoth from "mammoth";
import pdf from "pdf-parse";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function convertToMarkdownWithAI(text: string): Promise<string> {
  console.log("Starting AI conversion with text length:", text.length);
  console.log("First 200 characters of text:", text.substring(0, 200));

  try {
    console.log("Making OpenAI API request...");
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a document formatter. Convert the given text into well-structured markdown format, preserving the original content and structure while adding appropriate markdown formatting.",
        },
        {
          role: "user",
          content: text,
        },
      ],
      temperature: 0.3,
    });

    const result = response.choices[0].message.content || text;
    console.log("AI conversion successful!");
    console.log(
      "First 200 characters of converted markdown:",
      result.substring(0, 200)
    );
    return result;
  } catch (error) {
    console.error("Error converting text to markdown with AI:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
    }
    // Fall back to original text if AI conversion fails
    console.log("Falling back to original text");
    return text;
  }
}

/**
 * Converts a DOCX buffer to markdown using OpenAI
 * @param buffer Buffer containing the DOCX file data
 * @returns Promise containing the markdown text
 */
export async function docxToMarkdown(buffer: Buffer): Promise<string> {
  console.log("Starting DOCX conversion, buffer size:", buffer.length);
  try {
    console.log("Extracting raw text from DOCX...");
    const result = await mammoth.extractRawText({ buffer });
    console.log("Raw text extracted, length:", result.value.length);

    if (result.messages.length > 0) {
      console.log("Mammoth extraction messages:", result.messages);
    }

    const markdown = await convertToMarkdownWithAI(result.value);
    console.log("DOCX conversion completed successfully");
    return markdown;
  } catch (error) {
    console.error("Error converting DOCX to markdown:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
      console.error("Stack trace:", error.stack);
    }
    throw new Error("Failed to convert DOCX file to markdown");
  }
}

/**
 * Converts a PDF buffer to markdown using OpenAI
 * @param buffer Buffer containing the PDF file data
 * @returns Promise containing the markdown text
 */
export async function pdfToMarkdown(buffer: Buffer): Promise<string> {
  console.log("Starting PDF conversion, buffer size:", buffer.length);
  try {
    console.log("Parsing PDF buffer...");
    // Create a new Uint8Array from the buffer for pdf-parse
    const uint8Array = new Uint8Array(buffer);
    const data = await pdf(uint8Array, {
      // Disable the test file check
      version: "1.10.100",
      max: 0,
    });

    console.log("PDF metadata:", {
      pages: data.numpages,
      info: data.info,
      textLength: data.text.length,
    });

    const markdown = await convertToMarkdownWithAI(data.text);
    console.log("PDF conversion completed successfully");
    return markdown;
  } catch (error) {
    console.error("Error converting PDF to markdown:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
      console.error("Stack trace:", error.stack);
    }
    throw new Error("Failed to convert PDF file to markdown");
  }
}
