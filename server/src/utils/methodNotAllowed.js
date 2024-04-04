const methodNotAllowed = (req, res) => {
  res.status(405).json({
    message: `Method ${req.method} is not allowed on ${req.originalUrl}`,
  });
};

// KAFkDYcmITWzdZ19
export default methodNotAllowed;
