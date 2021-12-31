const Joi = require("joi");
const validateRequest = require("../utils/validateRequest");

module.exports = (req, res, next) => {
  const schema = Joi.object({
    page: Joi.number().min(1).default(1).integer(),
    size: Joi.number().max(50).min(1).default(10).integer(),
  });
  const testResult = validateRequest(req, res, next, schema, "query");

  if (!next) return testResult;
};
