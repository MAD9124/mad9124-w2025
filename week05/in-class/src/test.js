const morgan = require('morgan');

const ourMorgan = morgan('tiny');

const req = {
  url: '/tim',
  method: 'TIM',
};

const res = {
  status: 123,
  statusCode: 123,
};

const next = (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log('next');
};

ourMorgan(req, res, next);
