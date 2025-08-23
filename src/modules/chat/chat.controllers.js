import { globalUtils } from "#utils/index.js";
import { chatServices } from "./chat.services.js";

const { asyncHandler } = globalUtils;

export const chatControllers = {
  sendMessage: asyncHandler(async (request, response) => {
    const requestBody = request.body;
    const responseBody = await chatServices.sendMessage(requestBody);
    response.status(200).send(responseBody);
  }),

  getChatList: asyncHandler(async (request, response) => {
    const requestQuery = request.query;
    const responseBody = await chatServices.getChatList(requestQuery);
    response.status(200).send(responseBody);
  }),

  getMessageList: asyncHandler(async (request, response) => {
    const requestQuery = request.query;
    const responseBody = await chatServices.getMessageList(requestQuery);
    response.status(200).send(responseBody);
  }),
};
