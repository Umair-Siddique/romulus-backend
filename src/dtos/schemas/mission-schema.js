import { Joi } from "../validations.js";
import {
  organizationId,
  educatorId,
  title,
  description,
  branch,
  status,
  time,
  skills,
  startDate,
  endDate,
} from "../validations.js";
import { schemaUtils } from "./utils.js";

const { createFileUploadSchema, createUpdateSchema } = schemaUtils;

export const missionSchemas = {
  create: createFileUploadSchema(
    Joi.object({
      organization: organizationId.required(),
      educator: educatorId.optional(),
      title: title.required(),
      description: description.required(),
      branch: branch.required(),
      skills: skills.required(),
      startDate: startDate.required(),
      endDate: endDate.required(),
      startTime: time.required(),
      endTime: time.required(),
      status: status.optional(),
    })
  ),

  update: createUpdateSchema({
    title: title.optional(),
    description: description.optional(),
    branch: branch.optional(),
    startDate: startDate.optional(),
    endDate: endDate.optional(),
    startTime: time.optional(),
    endTime: time.optional(),
    status: status.optional(),
  }),
};
