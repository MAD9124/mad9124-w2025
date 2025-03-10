const validateStudent = (requireAll) => (req, res, next) => {
  const { firstName, lastName } = req.body;

  const errors = [];
  // both are required
  // min length 3 characters

  if (requireAll && !firstName) errors.push('First name required');
  if (firstName?.length < 3) errors.push('First name too short');
  if (requireAll && !lastName) errors.push('Last name required');
  if (lastName?.length < 3) errors.push('Last name too short');

  if (errors.length) {
    res.status(400).json({
      errors,
    });
    return;
  }
  next();
};

module.exports = validateStudent;
