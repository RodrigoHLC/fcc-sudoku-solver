const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
    test("Solve a puzzle with valid puzzle string: POST request to /api/solve", (done)=>{
        chai
            .request(server)
            .keepOpen()
            .post("/api/solve")
            .send({
                puzzle: ".7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6"
            })
            .end((err, res)=>{
                if(err){console.log(err)};
                assert.equal(res.status, 200, "Status should be 200!");
                assert.isObject(res.body, "Response is an object");
                assert.property(res.body, "solution", "Response object has a 'solution' property");
                assert.equal(res.body.solution, "473891265851726394926345817568913472342687951197254638734162589685479123219538746", "Response solves sudoku");
                done()
            })
    });
    test("Solve a puzzle with missing puzzle string: POST request to /api/solve", (done)=>{
        chai
            .request(server)
            .keepOpen()
            .post("/api/solve")
            .send({
                puzzle: ""
            })
            .end((err, res)=>{
                if(err){console.log(err)};
                assert.equal(res.status, 200, "Status should be 200!");
                // assert.isObject(res.body, "Response is an object");
                // assert.property(res.body, "error", "Response object has an 'error' property");
                assert.deepEqual(res.body, {error: "Required field missing"}, "Response solves sudoku");
                done()
            })
    })
    test("Solve a puzzle with invalid characters: POST request to /api/solve", (done) => {
        chai
            .request(server)
            .keepOpen()
            .post("/api/solve")
            .send({
                puzzle: ".7.89.....5....3.4.2..s..1.5689..472...6.....1.7.5.63803.1.2.8.6..47.1.+2.9.387.6"
            })
            .end((err,res) => {
                if(err){console.log(err)};
                assert.equal(res.status, 200, "Status wasn't 200!");
                assert.deepEqual(res.body, {error: "Invalid characters in puzzle"}, "Response return 'invalid characters'");
                done()
            });
    })
    test("Solve a puzzle with incorrect length: POST request to /api/solve", (done) => {
        chai
            .request(server)
            .keepOpen()
            .post("/api/solve")
            .send({
                puzzle: ".7.89.....5....3.4.2..4..1.5689..472...6..1.7.5.63873.1.2.8.6..47."
            })
            .end((err,res) => {
                if(err){console.log(err)};
                assert.equal(res.status, 200, "Status wasn't 200!");
                assert.deepEqual(res.body, {error: "Expected puzzle to be 81 characters long"}, "Response returns 'wrong length' object");
                done()
            })
    })
    test("Solve a puzzle that cannot be solved: POST request to /api/solve", (done) => {
        chai
            .request(server)
            .keepOpen()
            .post("/api/solve")
            .send({
                puzzle: "82..4..6...16..899..98315.749.157.............53..4...96.415..81..7632..3...28.51"
            })
            .end((err, res) =>{
                assert.equal(res.status, 200, "Status != 200");
                assert.deepEqual(res.body, {error: "Puzzle cannot be solved"}, "Invalid string");
                done();
            })
        
    })
    test("Check a puzzle placement with all fields: POST request to /api/check", (done) => {
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
                assert.deepEqual(res.body, {valid: true}, "'valid' property should be true");
                done()
            })
    })
    test("Check a puzzle placement with single placement conflict: POST request to /api/check", (done) => {
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
                done()
            })
    })
    test("Check a puzzle placement with all placement conflicts: POST request to /api/check", (done) => {
        chai
            .request(server)
            .keepOpen()
            .post("/api/check")
            .send({
                puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
                coordinate: "A2",
                value: "2"
            })
            .end((err,res) => {
                if(err){console.log(err)};
                assert.equal(res.status, 200, "Status != 200");
                assert.isObject(res.body, "Response is an object");
                assert.property(res.body, "valid", "Response object has 'valid' property");
                assert.equal(res.body.valid, false, "'valid' property should be 'false'");
                assert.isArray(res.body.conflict, "'conflict' property should be an array");
                assert.deepEqual(res.body, {valid:false, conflict:["column", "region"]});
                done()
            })
    })
    test("Check a puzzle placement with all placement conflicts: POST request to /api/check", (done) => {
        chai
            .request(server)
            .keepOpen()
            .post("/api/check")
            .send({
                puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
                coordinate: "A2",
                value: "5"
            })
            .end((err,res) => {
                if(err){console.log(err)};
                assert.equal(res.status, 200, "Status != 200");
                assert.isObject(res.body, "Response is an object");
                assert.property(res.body, "valid", "Response object has 'valid' property");
                assert.equal(res.body.valid, false, "'valid' property should be 'false'");
                assert.isArray(res.body.conflict, "'conflict' property should be an array");
                assert.deepEqual(res.body, {valid:false, conflict:["row", "column", "region"]});
                done()
            })
    })
    test("Check a puzzle placement with missing required fields: POST request to /api/check", (done) => {
        chai
            .request(server)
            .keepOpen()
            .post("/api/check")
            .send({
                puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
                coordinate: "",
                value: ""
            })
            .end((err,res) => {
                if(err){console.log(err)};
                assert.equal(res.status, 200, "Status != 200");
                assert.isObject(res.body, "Response is an object");
                assert.deepEqual(res.body, {error: "Required field(s) missing"});
                done()
            })
    })
    test("Check a puzzle placement with invalid characters: POST request to /api/check", (done) => {
        chai
            .request(server)
            .keepOpen()
            .post("/api/check")
            .send({
                puzzle: "..9..5.1.85.4..+.2432......1...69.83.9..0..6.62.71...9..f...1945....4.37.4.3..6..",
                coordinate: "a4",
                value: "3"
            })
            .end((err,res) => {
                if(err){console.log(err)};
                assert.equal(res.status, 200, "Status != 200");
                assert.isObject(res.body, "Response is an object");
                assert.deepEqual(res.body, { error: 'Invalid characters in puzzle' });
                done()
            })
    })
    test("Check a puzzle placement with incorrect length: POST request to /api/check", (done) => {
        chai
            .request(server)
            .keepOpen()
            .post("/api/check")
            .send({
                puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9...1945....4.37.4.3..6..",
                coordinate: "b3",
                value: "1"
            })
            .end((err,res) => {
                if(err){console.log(err)};
                assert.equal(res.status, 200, "Status != 200");
                assert.isObject(res.body, "Response is an object");
                assert.deepEqual(res.body, {error: "Expected puzzle to be 81 characters long"});
                done()
            })
    })
    test("Check a puzzle placement with invalid placement coordinate: POST request to /api/check: POST request to /api/check", (done) => {
        chai
            .request(server)
            .keepOpen()
            .post("/api/check")
            .send({
                puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
                coordinate: "s15",
                value: "3"
            })
            .end((err,res) => {
                if(err){console.log(err)};
                assert.equal(res.status, 200, "Status != 200");
                assert.isObject(res.body, "Response is an object");
                assert.deepEqual(res.body, {error: "Invalid coordinate"});
                done()
            })
    })
    test("Check a puzzle placement with invalid placement value: POST request to /api/check: POST request to /api/check", (done) => {
        chai
            .request(server)
            .keepOpen()
            .post("/api/check")
            .send({
                puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
                coordinate: "C3",
                value: "0"
            })
            .end((err,res) => {
                if(err){console.log(err)};
                assert.equal(res.status, 200, "Status != 200");
                assert.isObject(res.body, "Response is an object");
                assert.deepEqual(res.body, {error: "Invalid value"});
                done()
            })
    })
});

