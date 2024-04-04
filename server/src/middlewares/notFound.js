const notFound = (req, res, next) => {
  // const error = new Error("Route Not Found");
  const error = {
    message: "Route Not Found",
  };
  res.statusCode = 404;
  next(error)
};

export default notFound;
