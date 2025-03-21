const xss = require('xss');

const sanitize = (str) =>
  xss(str, {
    whiteList: [], // empty, means filter out all tags
    stripIgnoreTag: true, // filter out all HTML not in the whitelist
    stripIgnoreTagBody: ['script'],
    // the script tag is a special case, we need
    // to filter out its content
  });

const checkType = (value) => {
  if (Array.isArray(value)) {
    return value.map(checkType);
  }
  if (value instanceof Object) {
    return stripTags(value);
  }
  if (typeof value === 'string') {
    return sanitize(value);
  }
  return value;
};

const stripTags = (body) => {
  const { ...attributes } = body;

  for (const key in attributes) {
    attributes[key] = checkType(attributes[key]);
  }
  return attributes;
};

const sanitizeBody = (req, res, next) => {
  const { id, _id, ...attributes } = req.body;
  req.sanitizedBody = stripTags(attributes);

  next();
};

module.exports = sanitizeBody;
