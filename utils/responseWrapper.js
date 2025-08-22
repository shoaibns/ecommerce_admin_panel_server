const sendSuccess = (res, statusCode, message, data = undefined) => {
  return res.status(statusCode).send({
    success: true,
    message,
    data,
  });
};

const sendError = (res, message, error = null) => {
  return res.status(400).send({
    success: false,
    message,
    ...(error && { error: error?.message || error }),
  });
};

export { sendSuccess, sendError };