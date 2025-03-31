const validateStudent = (requireAll) => (req, res, next) => {
  const { firstName, lastName } = req.body;

  const errors = [];
  // both are required
  // min length 3 characters

  if (requireAll && !firstName) errors.push('First name required');
  if (requireAll && !lastName) errors.push('Last name required');

  if (errors.length) {
    res.status(400).json({
      errors,
    });
    return;
  }
  next();
};

module.exports = validateStudent;
