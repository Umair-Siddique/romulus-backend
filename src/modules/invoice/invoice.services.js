import { dataAccess } from "#dataAccess/index.js";

const { read } = dataAccess;

export const invoiceServices = {
  generateInvoice: async (requestBody) => {
    const { missionsData } = requestBody;

    for (const missionData of missionsData) {
      const educator = await read.educatorById(missionData.hiredEducator);
      const educatorName = `${educator?.firstName} ${educator?.lastName}`;

      missionData.educatorName = educatorName;
      delete missionData.hiredEducator;
    }

    return {
      success: true,
      message: "Invoice generated successfully.",
      data: missionsData,
    };
  },
};
