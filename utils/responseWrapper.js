const sendSuccess = (res, statusCode, message, data = undefined) => {
  return res.status(statusCode).send({
    status: "success",
    message,
    data,
  });
};

const sendError = (res, message, error = null) => {
  return res.status(400).send({
    status: "error",
    message,
    ...(error && { error: error?.message || error }),
  });
};  

export { sendSuccess, sendError };