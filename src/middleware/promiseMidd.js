module.exports = {
  promiseMiddleware: (fn) => async (request, response, next) => {
    try {
      await fn(request, response, next);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
};
