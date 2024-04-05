const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

chai.use(chaiHttp);
const mocha = require('mocha');
const before = mocha.before; 

suite('Unit Tests', () => {
    test("Logic handles a valid puzzle string of 81 characters", (done)=>{
        chai
            .request(server)
            .keepOpen()
            .post("/api/solve")
            .send({
                puzzle: ".7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6"
                //, solver.solve(req.body.puzzle)
            })
            .end((err, res)=>{
                if(err){console.log(err)};
                assert.equal(res.status, 200, "Status wasn't 200!");
                assert.isObject(res.body, "Response is an object");
                assert.property(res.body, "solution", "Response object has a 'solution' property");
                assert.equal(res.body.solution, "473891265851726394926345817568913472342687951197254638734162589685479123219538746", "Response solves sudoku");
                assert.equal(solver.solve("5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3").solution, "568913724342687519197254386685479231219538467734162895926345178473891652851726943", "String 1");
                assert.equal(solver.solve("..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1").solution, "218396745753284196496157832531672984649831257827549613962415378185763429374928561", "String 2");
                assert.equal(solver.solve("82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51").solution, "827549163531672894649831527496157382218396475753284916962415738185763249374928651", "String 3");
                done()
            })
    })
    test("Logic handles a puzzle string with invalid characters (not 1-9 or .)", (done) => {
        chai
            .request(server)
            .keepOpen()
            .post("/api/solve")
            .send({
                puzzle: ".7.89.....5....3.4.2..s..1.5689..472...6.....1.7.5.63803.1.2.8.6..47.1..2.9.387.6"
            })
            .end((err,res) => {
                if(err){console.log(err)};
                assert.equal(res.status, 200, "Status wasn't 200!");
                assert.isObject(res.body, "Response is an object");
                assert.property(res.body, "error", "Response object has 'error' property");
                assert.equal(res.body.error, "Invalid characters in puzzle", "Response return 'invalid characters'");
                assert.equal(solver.solve(".7.89.....5....3.4.2..4..1.5689..472...6..0..1.7.5.63873.1.2.8.6..47.1..2.9.387.6").error, "Invalid characters in puzzle", "Bad string with a '0'");
                assert.equal(solver.solve(".7.89.....5....3.4.2..4..1.5689..472...6..a..1.7.5.63873.1.2.8.6..47.1..2.9.387.6").error, "Invalid characters in puzzle", "Bad string with an 'a'");
                assert.equal(solver.solve(".7.89.....5....3.4.2..4..1.5689..472...6.%...1.7.5.63873.1.2.8.6..47.1..2.9.387.6").error, "Invalid characters in puzzle", "Bad string with a '%' sign");
                assert.equal(solver.solve(".7.89.....5....3.4.2..4..1.5689..472...6. ...1.7.5.63873.1.2.8.6..47.1..2.9.387.6").error, "Invalid characters in puzzle", "Bad string with a space");
                done()
            });
    })
    test("Logic handles a puzzle string that is not 81 characters in length", (done) => {
        chai
            .request(server)
            .keepOpen()
            .post("/api/solve")
            .send({
                puzzle: ".7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47."
            })
            .end((err,res) => {
                if(err){console.log(err)};
                assert.equal(res.status, 200, "Status wasn't 200!");
                assert.isObject(res.body, "Response is an object");
                assert.property(res.body, "error", "Response object has 'error' property");
                assert.equal(res.body.error, "Expected puzzle to be 81 characters long", "Response returns 'wrong length' message");
                assert.equal(solver.solve("5..91372.3...8.5.9.9.25...95..46.7.4.....5.2.......4..8916..85.72...3").error, "Expected puzzle to be 81 characters long", "Shorter string");
                assert.equal(solver.solve("5..91372.3...8.5.9.9.25....5488.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3").error, "Expected puzzle to be 81 characters long", "Longer string");
                done()
            })
    })
    test("Logic handles a valid row placement", (done) => {
        chai
            .request(server)
            .keepOpen()
            .post("/api/check")
            .send({
                puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
                coordinate: "B3",
                value: "1"
            })
            .end((err,res) => {
                if(err){console.log(err)};
                assert.equal(res.status, 200, "Status != 200");
                assert.isObject(res.body, "Response is an object");
                assert.property(res.body, "valid", "Response object has 'valid' property");
                assert.equal(res.body.valid, true, "'valid' property should be true");
                assert.equal(solver.checkPlacement(".7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6","G5","6").valid, true, "Valid placement 1");
                assert.equal(solver.checkPlacement(".7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6","g9","5").valid, true, "Valid placement 2");
                assert.equal(solver.checkPlacement(".7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6","G9","9").valid, true, "Valid placement 3");
                assert.equal(solver.checkPlacement("82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51","E2","7").valid, true, "Valid placement 4");
                assert.equal(solver.checkPlacement("82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51","e2","8").valid, true, "Valid placement 5");
                done()
            })
    })
    test("Logic handles an invalid row placement", (done) => {
        chai
            .request(server)
            .keepOpen()
            .post("/api/check")
            .send({
                puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
                coordinate: "A2",
                value: "1"
            })
            .end((err,res) => {
                if(err){console.log(err)};
                assert.equal(res.status, 200, "Status != 200");
                assert.isObject(res.body, "Response is an object");
                assert.property(res.body, "valid", "Response object has 'valid' property");
                assert.equal(res.body.valid, false, "'valid' property should be 'false'");
                assert.isArray(res.body.conflict, "'conflict' property should be an array");
                assert.deepEqual(res.body, {valid:false, conflict:["row"]});
                assert.isFalse(solver.checkPlacement(".7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6", "a6", "7").valid,  "'valid' property should be 'false'");
                assert.deepEqual(solver.checkPlacement(".7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6", "a6", "7").conflict, ["row"], "'conflict' property should be '['row']' (1)"),
                assert.isFalse(solver.checkPlacement("82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51", "f8", "3").valid,  "'valid' property should be 'false'");
                assert.deepEqual(solver.checkPlacement("82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51", "f8", "3").conflict, ["row"], "'conflict' property should be '['row']' (2)");
                done()
            })
    })
    test("Logic handles a valid column placement", (done) => {
        chai
            .request(server)
            .keepOpen()
            .post("/api/check")
            .send({
                puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
                coordinate: "a2",
                value: 7
            })
            .end((err,res) => {
                if(err){console.log(err)};
                assert.equal(res.status, 200, "status != 200");
                assert.isObject(res.body, "Response is an object");
                assert.deepEqual(res.body, {valid:true}), "Valid column response";
                assert.deepEqual(solver.checkPlacement(".7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6", "g1", 7), {valid:true}, "Valid column placement (1)"),
                assert.deepEqual(solver.checkPlacement("82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51", "a3", 5), {valid:true}, "Valid column placement (2)");
                done()
            })
    })
    test("Logic handles an invalid column placement", (done) => {
        chai
            .request(server)
            .keepOpen()
            .post("/api/check")
            .send({
                puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
                coordinate: "a1",
                value: "6"
            })
            .end((err,res) => {
                if(err){console.log(err)};
                assert.equal(res.status, 200, "Status != 200");
                assert.isObject(res.body, "Response is an object");
                assert.deepEqual(res.body, {valid:false, conflict:["column"]});
                assert.deepEqual(solver.checkPlacement(".7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6", "g5", 9).conflict, ["column"], "'conflict' property should be '['column']' (1)"),
                assert.deepEqual(solver.checkPlacement("82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51", "E9", 8).conflict, ["column"], "'conflict' property should be '['column']' (2)");
                done()
            })
    })
    test("Logic handles a valid region (3x3 grid) placement", (done) => {
        chai
            .request(server)
            .keepOpen()
            .post("/api/check")
            .send({
                puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
                coordinate: "B3",
                value: "1"
            })
            .end((err,res) => {
                if(err){console.log(err)};
                assert.equal(res.status, 200, "status != 200");
                assert.isObject(res.body, "Response is an object");
                assert.deepEqual(res.body, {valid:true}), "Valid region response";
                assert.deepEqual(solver.checkPlacement(".7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6", "e6", 7), {valid:true}, "Valid region placement (1)"),
                assert.deepEqual(solver.checkPlacement("82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51", "e8", 3), {valid:true}, "Valid region placement (2)");
                done()
            })
    })
    test("Logic handles an invalid region (3x3 grid) placement", (done) => {
        chai
            .request(server)
            .keepOpen()
            .post("/api/check")
            .send({
                puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
                coordinate: "a1",
                value: 2
            })
            .end((err,res) => {
                if(err){console.log(err)};
                assert.equal(res.status, 200, "Status != 200");
                assert.isObject(res.body, "Response is an object");
                assert.deepEqual(res.body, {valid:false, conflict:["region"]});
                assert.deepEqual(solver.checkPlacement(".7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6", "e8", 2).conflict, ["region"], "'conflict' property should be '['region']' (1)"),
                assert.deepEqual(solver.checkPlacement("82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51", "E2", 3).conflict, ["region"], "'conflict' property should be '['region']' (2)");
                done()
            })
    })
    test("Valid puzzle strings pass the solver", () => {
        let solutionObject = solver.solve("5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3");
        assert.isObject(solutionObject, "Response should be an object (1)");
        assert.property(solutionObject, "solution", "Response object should have a 'solution' key (1)");
        assert.isString(solutionObject.solution, "Response object solution should be a string (1)");
        assert.match(solutionObject.solution, /^[1-9]+$/, "Response object solution should be a string of only numbers (1)");

        solutionObject = solver.solve("..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1");
        assert.isObject(solutionObject, "Response should be an object (2)");
        assert.property(solutionObject, "solution", "Response object should have a 'solution' key (2)");
        assert.isString(solutionObject.solution, "Response object solution should be a string (2)");
        assert.match(solutionObject.solution, /^[1-9]+$/, "Response object solution should be a string of only numbers (2)");

        solutionObject = solver.solve(".7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6");
        assert.isObject(solutionObject, "Response should be an object (3)");
        assert.property(solutionObject, "solution", "Response object should have a 'solution' key (3)");
        assert.isString(solutionObject.solution, "Response object solution should be a string (3)");
        assert.match(solutionObject.solution, /^[1-9]+$/, "Response object solution should be a string of only numbers (3)");
        
        solutionObject = solver.solve("82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51");
        assert.isObject(solutionObject, "Response should be an object (4)");
        assert.property(solutionObject, "solution", "Response object should have a 'solution' key (4)");
        assert.isString(solutionObject.solution, "Response object solution should be a string (4)");
        assert.match(solutionObject.solution, /^[1-9]+$/, "Response object solution should be a string of only numbers (4)");
    })
    test("Invalid puzzle strings fail the solver", () => {
                // assert.equal(res.status, 200, "Status != 200");
                // assert.isObject(res.body, "Response is an object");
                assert.deepEqual(solver.solve("82..4..6...16..899..98315.749.157.............53..4...96.415..81..7632..3...28.51"), {error: "Puzzle cannot be solved"}, "Invalid string (1)");
                assert.deepEqual(solver.solve("82..4..6...16..89...98315.749.157.............534.4...96.45..81..7632..3...28.51."), {error: "Puzzle cannot be solved"}, "Invalid string (2)")
                assert.deepEqual(solver.solve("..9..5.3.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."), {error: "Puzzle cannot be solved"}, "Invalid string (3)")
                assert.deepEqual(solver.solve("..9..5.1.85.4....2432.453.1...69.83.9..575..576.62.71...9..677..1945....4.37.4.3."), {error: "Puzzle cannot be solved"}, "Invalid string (4)")
    })
    test("Solver returns the expected solution for an incomplete puzzle", () => {
        let solutionObject = solver.solve("5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3");
        assert.isObject(solutionObject, "Response is an object");
        assert.deepEqual(solutionObject, {solution: "568913724342687519197254386685479231219538467734162895926345178473891652851726943"}, "Incorrect solution object (1)");

        solutionObject = solver.solve("..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1");
        assert.deepEqual(solutionObject, {solution: "218396745753284196496157832531672984649831257827549613962415378185763429374928561"}, "Incorrect solution object (2)");

        solutionObject = solver.solve(".7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6")
        assert.deepEqual(solutionObject, {solution: "473891265851726394926345817568913472342687951197254638734162589685479123219538746"}, "Incorrect solution object (3)");

        solutionObject = solver.solve("82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51");
        assert.deepEqual(solutionObject, {solution: "827549163531672894649831527496157382218396475753284916962415738185763249374928651"}, "Incorrect solution object (4)");
    })
})
