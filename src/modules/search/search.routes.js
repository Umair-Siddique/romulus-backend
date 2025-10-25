import express from "express";
import { searchControllers } from "./search.controllers.js";

export const searchRoutes = express.Router();

searchRoutes.get("/", searchControllers.search);
