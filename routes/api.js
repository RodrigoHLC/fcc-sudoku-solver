'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      res.json(solver.checkPlacement(req.body.puzzle, req.body.coordinate.toUpperCase(), req.body.value));
      // res.json(solver.checkRowPlacement(req.body.puzzle));
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      // validate() IS CALLED INSIDE .solve() FIRST
      res.json(solver.solve(req.body.puzzle))
    });
};
