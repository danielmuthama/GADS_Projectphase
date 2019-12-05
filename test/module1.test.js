const esprima = require("esprima");
const gameoflife = require("../js/gameoflife.js");

describe("Conway's Game of Life", () => {
  describe("Seed function", () => {
    it("Should add a `seed` function. @seed-function", () => {
      assert(
        gameoflife.seed,
        "Have you created and exported a `seed` function?"
      );
    });

    it("Should have a `seed` function that converts arguments to a real array. @seed-returns-array", () => {
      assert(
        Array.isArray(gameoflife.seed([1, 2], [5, 6])) &&
          gameoflife.seed([1, 2], [5, 6]).length === 2,
        "Have you converted `arguments` to a real array?"
      );
    });
  });

  describe("Same function", () => {
    it("Should have a `same` function. @same-function", () => {
      assert(
        gameoflife.same,
        "Have you created and exported a `same` function?"
      );
    });

    it("Should have a `same` function that tests if two points are the same. @same-function-comparison", () => {
      assert(
        gameoflife.same([1, 2], [1, 2]),
        "Have you created a `same` function that returns true if the two point parameters are the same?"
      );
      assert(
        !gameoflife.same([1, 2], [5, 2]),
        "Have you created a `same` function that returns false if the two point parameters are not the same?"
      );
    });
  });

  describe("Contains function", () => {
    it("Should have a `contains` function. @contains-function", () => {
      assert(
        gameoflife.contains,
        "Have you created and exported a `contains` function?"
      );
    });

    it("Should have a `contains` function that tests if a cell is alive within the passed game state. @contains-test", () => {
      const boundContains = gameoflife.contains.bind([
        [1, 2],
        [3, 4],
        [4, 4]
      ]);
      assert(
        boundContains([1, 2]) && boundContains([3, 4]) && boundContains([4, 4]),
        "Have you implemented a check that the passed cell is in the passed game state?"
      );
      assert(
        !(
          boundContains([5, 6]) ||
          boundContains([2, 1]) ||
          boundContains([3, 3])
        ),
        "Have you implemented a check that the passed cell is in the passed game state?"
      );
    });
  });

  describe("Sum function", () => {
    it("Should have a `sum` function. @sum-function", () => {
      assert(gameoflife.sum, "Have you created and exported a `sum` function?");
    });

    it("Should have a `sum` function that sums two cells. @sum-addition", () => {
      assert(
        gameoflife.same(gameoflife.sum([1, 2], [5, 7]), [6, 9]),
        "Have you implemented a sum function that adds two cells?"
      );
      assert(
        gameoflife.same(gameoflife.sum([-1, 2], [5, -7]), [4, -5]),
        "Have you implemented a sum function that deals with negative coordinates?"
      );
    });

    it("Should have a `sum` function that is a single-line arrow function. @sum-arrow-function", () => {
      var sumNode;
      const esprimaAst = esprima.parseModule(source, {}, function(node) {
        if (node.type === "VariableDeclarator" && node.id.name === "sum") {
          sumNode = node;
        }
      });
      assert(sumNode, "Have you implemented a function named `sum`?");
      assert(
        sumNode.init.type === "ArrowFunctionExpression",
        "Have you implemented an arrow function named `sum`?"
      );
      assert(
        sumNode.init.body.type === "ArrayExpression",
        "Have you implemented an arrow function named `sum`?"
      );
    });
  });

  describe("Finding the corners", () => {
    const corners = gameoflife.corners([
      [2, 3],
      [2, 1],
      [4, 3],
      [1, 1],
      [2, 1],
      [3, 1]
    ]);

    it("should find a top right", () => {
      assert(corners.topRight, "");
      assert(Array.isArray(corners.topRight), "");
      assert(corners.topRight.length === 2, "");
    });

    it("should find the correct top right", () => {
      assert(
        gameoflife.same(corners.topRight, [4, 3]),
        "Have you implemented a corners function that returns the correct top right coordinate?"
      );
    });

    it("should find a bottom left", () => {
      assert(corners.bottomLeft, "");
      assert(Array.isArray(corners.bottomLeft), "");
      assert(corners.bottomLeft.length === 2, "");
    });

    it("should find the correct bottom left", () => {
      assert(
        gameoflife.same(corners.bottomLeft, [1, 1]),
        "Have you implemented a corners function that returns the correct bottom left coordinate?"
      );
    });
  });

  describe('Calculating the next state', ()=>{
    const start = gameoflife.seed([3,2], [2,3],[3,3],[3,4],[4,4]);
    const next = gameoflife.calculateNext(start);
    it('should calculate the correct next state', ()=>{
      // todo
    });
  });
});
