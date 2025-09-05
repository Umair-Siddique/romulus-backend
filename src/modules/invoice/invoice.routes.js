import express from "express";

import { invoiceControllers } from "./invoice.controllers.js";

export const invoiceRoutes = express.Router();

invoiceRoutes.post("/generate", invoiceControllers.generateInvoice);
