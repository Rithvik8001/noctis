import { type Request, type Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { agentTools } from "../../../agent/tools";
import { executeTool } from "../../../agent/executor";
import chatValidation from "../../validations/agent/chat";
import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";
import asyncHandler from "../../utils/asyncHandler";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

const chatController = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId;

  if (!userId) {
    throw new ApiError(401, "Unauthorized.");
  }

  const validationResult = chatValidation(req.body);
  if (!validationResult.success) {
    throw new ApiError(
      400,
      validationResult.error.issues[0]?.message ?? "Invalid data.",
    );
  }

  const { message } = validationResult.data;

  const model = genAI.getGenerativeModel({
    model: `gemini-2.5-flash`,
    tools: [{ functionDeclarations: agentTools }],
    systemInstruction: `You are a helpful note-taking
  assistant. Today's date is ${new Date().toISOString()}.
      When a user describes something they need to do,
  create a note for it.
      When they say they completed something, find the
  relevant note and mark it done.
      Always confirm what you did in a friendly, concise
  way.`,
  });

  const chat = model.startChat();
  let result = await chat.sendMessage(message);
  let response = result.response;

  while (response.functionCalls() && response.functionCalls()!.length > 0) {
    const functionCalls = response.functionCalls()!;

    const toolResults = await Promise.all(
      functionCalls.map(async (call) => {
        const toolResult = await executeTool(
          call.name,
          call.args as any,
          userId,
        );
        return {
          functionResponse: {
            name: call.name,
            response: toolResult,
          },
        };
      }),
    );

    result = await chat.sendMessage(toolResults);
    response = result.response;
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Chat response.", { message: response.text() }));
});

export default chatController;
