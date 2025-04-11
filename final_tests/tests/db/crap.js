const { convertJSON } = require('../helpers');

const { Crap, User } = global;

const createCrap = async (crap) => {
  const { insertedId } = await Crap.insertOne(crap);
  return insertedId;
};

const getCrapRaw = async () => {
  const crap = await Crap.find(
    {},
    { projection: { updatedAt: 0, createdAt: 0, __v: 0 } }
  ).toArray();

  return crap.map((p) =>
    convertJSON({
      ...p,
      _id: p._id.toString(),
    })
  );
};

const getCrap = async (query, projection) => {
  const crap = await Crap.find(query ? query : {}, {
    projection: {
      ...(projection ? projection : {}),
      updatedAt: 0,
      createdAt: 0,
      __v: 0,
    },
  }).toArray();

  const users = await User.find({}, { projection: { name: 1 } }).toArray();

  return crap.map((p) =>
    convertJSON({
      ...p,
      _id: p._id.toString(),
      owner:
        users.find((u) => u._id.toString() === p.owner.toString()) || p.owner,
      ...(p.buyer
        ? {
            buyer:
              users.find((u) => u._id.toString() === p.buyer.toString()) ||
              p.owner,
          }
        : {}),
    })
  );

  return crap.map((p) => convertJSON({ ...p, _id: p._id.toString() }));
};

module.exports = {
  createCrap,
  getCrapRaw,
  getCrap,
};
