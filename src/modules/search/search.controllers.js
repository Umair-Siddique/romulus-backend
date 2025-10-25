import { globalUtils } from "#utils/index.js";
import { searchServices } from "./search.services.js";

const { asyncHandler } = globalUtils;

export const searchControllers = {
  search: asyncHandler(async (request, response) => {
    const requestQuery = request.query;
    const responseBody = await searchServices.search(requestQuery);
    response.json(responseBody);
  }),
};
