const helper = require('../helpers/index');
const { CustomErrorAPI } = require('../helpers/CustomError');

module.exports = {
  errorMiddleware: (error, request, response, next) => {
    if (error instanceof CustomErrorAPI) {
      return helper.response(response, error.statusCode, { message: `${error.message}` });
    }
    return helper.response(response, 500, { message: `Internal Server Error,${error.message}` }, error);
  },
};
