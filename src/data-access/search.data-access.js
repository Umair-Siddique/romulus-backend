import { EducatorModel, OrganizationModel } from "#models/index.js";

export const searchDataAccess = {
  read: {
    educatorsBySearch: (query) => {
      const regexMatch = {
        $or: [
          { firstName: { $regex: query, $options: "i" } },
          { lastName: { $regex: query, $options: "i" } },
          { organizationName: { $regex: query, $options: "i" } },
        ],
      };

      const pipeline = [
        { $match: regexMatch },
        {
          $project: {
            user: 1,
            avatar: 1,
            firstName: 1,
            lastName: 1,
            organizationName: 1,
          },
        },
      ];

      return EducatorModel.aggregate(pipeline);
    },

    organizationsBySearch: (query) => {
      const regexMatch = {
        $or: [
          { firstName: { $regex: query, $options: "i" } },
          { lastName: { $regex: query, $options: "i" } },
          { organizationName: { $regex: query, $options: "i" } },
        ],
      };

      const pipeline = [
        { $match: regexMatch },
        {
          $project: {
            user: 1,
            avatar: 1,
            firstName: 1,
            lastName: 1,
            organizationName: 1,
          },
        },
      ];

      return OrganizationModel.aggregate(pipeline);
    },

    educatorsAndOrganizationsBySearch: async (query) => {
      const educatorResults =
        await searchDataAccess.read.educatorsBySearch(query);
      const organizationResults =
        await searchDataAccess.read.organizationsBySearch(query);

      const result = [...educatorResults, ...organizationResults];

      return result;
    },
  },
};
