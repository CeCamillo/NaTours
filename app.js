// Kinda convention to keep every express config in the app.js
const fs = require('fs');
const express = require('express');

const app = express();

app.use(express.json());

// app.get('/', (req, res) => {
//   res.status(200).json({ message: 'OK' });
// });

// app.post('/', (req, res) => {
//   res.send('You can post to this endpoint');
// });

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/data/tours-simple.json`)
);

app.get('/tours', (req, res) => {
  res.status(200).json({
    status: 'ok',
    results: tours.length,
    data: {
      tours,
    },
  });
});

app.get('/tours/:id', (req, res) => {
  console.log(req.params);

  const id = req.params.id * 1; // converting to number
  const tour = tours.find((element) => element.id === id);

  // if (id > tours.length) {
  if (!tour) {
    // testing for invalid ID's
    return res.status(404).json({
      status: 'fail',
      mesage: 'invalid ID',
    });
  }

  res.status(200).json({
    status: 'ok',
    data: {
      tour,
    },
  });
});

app.post('/tours', (req, res) => {
  // console.log(req.body);

  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/data/tours-simple`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
});

app.patch('/tours/:id', (req, res) => {
  if (req.params.id * 1 > tours.length) {
    // testing for invalid ID's
    return res.status(404).json({
      status: 'fail',
      mesage: 'invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<updated tour goes here...>',
    },
  });
});

app.delete('/tours/:id', (req, res) => {
  if (req.params.id * 1 > tours.length) {
    // testing for invalid ID's
    return res.status(404).json({
      status: 'fail',
      mesage: 'invalid ID',
    });
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

app.listen(8000, () => {
  console.log(`Server running on: http://localhost:8000`);
});
