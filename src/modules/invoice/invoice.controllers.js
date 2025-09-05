import { globalUtils } from "#utils/index.js";
import { invoiceServices } from "./invoice.services.js";

const { asyncHandler } = globalUtils;

export const invoiceControllers = {
  generateInvoice: asyncHandler(async (request, response) => {
    const requestBody = request.body;
    const responseBody = await invoiceServices.generateInvoice(requestBody);
    response.status(200).json(responseBody);
  }),
};
