import { dataAccess } from "#dataAccess/index.js";

const { read } = dataAccess;

export const invoiceServices = {
  generateInvoice: async (requestBody) => {
    const { missionsData } = requestBody;

    for (const missionData of missionsData) {
      const educator = await read.educatorById(missionData.hiredEducator);
      const educatorName = `${educator?.firstName} ${educator?.lastName}`;
      const educatorHourlyRate = educator?.hourlyRate;

      missionData.educatorName = educatorName;
      missionData.educatorHourlyRate = educatorHourlyRate;
      delete missionData.hiredEducator;
    }

    return {
      success: true,
      message: "Invoice generated successfully.",
      data: missionsData,
    };
  },
};
