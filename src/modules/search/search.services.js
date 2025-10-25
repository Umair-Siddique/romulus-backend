import createError from "http-errors";

import { dataAccess } from "#dataAccess/index.js";

const { read } = dataAccess;

export const searchServices = {
  search: async (requestQuery) => {
    const { q, role } = requestQuery;
    const query = q.trim();

    if (!query) throw createError(400, "Query is required.");

    let results = [];

    if (role === "admin") {
      results = await read.educatorsAndOrganizationsBySearch(query);
      results = results.map((result) => {
        return {
          ...result,
          _id: result.user,
          user: undefined,
        };
      });
    }

    if (role === "organization") {
      results = await read.educatorsBySearch(query);
      results = results.map((result) => {
        return {
          ...result,
          _id: result.user,
          user: undefined,
        };
      });
    }

    if (role === "educator") {
      results = await read.organizationsBySearch(query);
      results = results.map((result) => {
        return {
          ...result,
          _id: result.user,
          user: undefined,
        };
      });
    }

    return {
      success: true,
      message: "Search results.",
      data: results,
    };
  },
};
