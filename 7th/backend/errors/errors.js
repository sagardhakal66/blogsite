export async function createError(err, res) {
  err = {
    message: err.message || "Something went wrong",
    error: JSON.stringify(err),
    data: {},
  };
  res.status(400).json(err);
}
