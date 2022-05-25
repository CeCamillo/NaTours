// Kinda convention to keep every express config in the app.js
const fs = require('fs');
const express = require('express');

const app = express();

app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/data/tours-simple.json`)
);

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'ok',
    results: tours.length,
    data: {
      tours,
    },
  });
};

const getTour = (req, res) => {
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
};

const createTour = (req, res) => {
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
};

const updateTour = (req, res) => {
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
};

const deleteTour = (req, res) => {
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
};

// app.get('/tours', getAllTours);
// app.get('/tours/:id', getTour);
// app.post('/tours', createTour);
// app.patch('/tours/:id', updateTour);
// app.delete('/tours/:id', deleteTour);

app.route('/tours').get(getAllTours).post(createTour);
app.route('/tours/:id').get(getTour).patch(updateTour).delete(deleteTour);

app.listen(8000, () => {
  console.log(`Server running on: http://localhost:8000`);
});
