function add(a, b) {
  return a + b;
}

test('add', () => {
  const res = add(1, 2);
  expect(res).toBe(3);
});

function combineObjects(obj1, obj2) {
  Object.assign(obj1, obj2);
  return obj1;
}

test('correct result', () => {
  const res = combineObjects({ a: 'A' }, { b: 'B' });
  expect(res).toEqual({ a: 'A', b: 'B' });
});

test('should mutate original', () => {
  const obj1 = { a: 'A' };
  const res = combineObjects(obj1, { b: 'B' });

  expect(res).toEqual({ a: 'A', b: 'B' });
  expect(obj1).toBe(res);
});

test('asdfa', () => {
  const a = {};
  expect(a).toEqual({});
});

function mockMongoCreate(input) {
  return { _id: Math.PI, ...input };
}

test('another test', () => {
  const result = mockMongoCreate({ one: '1' });
  console.log(result);
  expect(result).toMatchObject({ one: '1' });
});
