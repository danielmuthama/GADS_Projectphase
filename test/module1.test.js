const esprima = require("esprima");
const gameoflife = require("../js/gameoflife.js");

describe("Conway's Game of Life", () => {
  describe("Seed function", () => {
    it("Should add a `seed` function. @seed-function", () => {
      assert(
        gameoflife.seed,
        "Have you created and exported a `seed` function?"
      );

      assert(
        gameoflife.seed &&
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

      var sameNode;
      esprima.parseModule(source, {}, function(node) {
        if (node.id && node.id.name === "same") {
          sameNode = node;
        }
      });
      assert(
        sameNode.params.length === 2,
        "Have you created a `same` function with two arguments?"
      );

      assert(
        gameoflife.same && gameoflife.same([1, 2], [1, 2]),
        "Have you created a `same` function that returns true if the two point parameters are the same?"
      );
      assert(
        gameoflife.same && !gameoflife.same([1, 2], [5, 2]),
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

      const boundContains = (gameoflife.contains || (() => {})).bind([
        [1, 2],
        [3, 4],
        [4, 4]
      ]);
      assert(
        gameoflife.contains &&
          boundContains([1, 2]) &&
          boundContains([3, 4]) &&
          boundContains([4, 4]),
        "Have you implemented a check that the passed cell is in the passed game state?"
      );
      assert(
        gameoflife.contains &&
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

      assert(
        gameoflife.sum &&
          gameoflife.same &&
          gameoflife.same(gameoflife.sum([1, 2], [5, 7]), [6, 9]),
        "Have you implemented a sum function that adds two cells?"
      );
      assert(
        gameoflife.sum &&
          gameoflife.same &&
          gameoflife.same(gameoflife.sum([-1, 2], [5, -7]), [4, -5]),
        "Have you implemented a sum function that handles negative coordinates?"
      );

      var sumNode;
      esprima.parseModule(source, {}, function(node) {
        if (node.type === "VariableDeclarator" && node.id.name === "sum") {
          sumNode = node;
        }
      });
      assert(sumNode, "Have you implemented an arrow function named `sum`?");
      assert(
        sumNode && sumNode.init.type === "ArrowFunctionExpression",
        "Have you implemented an arrow function named `sum`?"
      );
      assert(
        sumNode && sumNode.init.body.type === "ArrayExpression",
        "Have you implemented an arrow function named `sum`?"
      );
    });
  });

  describe("Printing a cell", () => {
    it("Should have a printCell function. @printCell-function", () => {
      assert(
        gameoflife.printCell,
        "Have you created and exported a `printCell` function?"
      );

      assert(
        gameoflife.printCell &&
          gameoflife.printCell(
            [1, 1],
            [
              [1, 1],
              [2, 2]
            ]
          ) == "\u25A3",
        "Have you returned '\u25A3' for living cells?"
      );
      assert(
        gameoflife.printCell &&
          gameoflife.printCell(
            [1, 2],
            [
              [1, 1],
              [2, 2]
            ]
          ) == "\u25A2",
        "Have you returned '\u25A2' for non-living cells?"
      );
    });
  });

  describe("Finding the corners", () => {
    var corners;
    before(() => {
      corners = gameoflife.corners([
        [2, 3],
        [2, 1],
        [4, 3],
        [1, 1],
        [2, 1],
        [3, 1]
      ]);
    });

    it("Should have a corners function. @corners-function", () => {
      assert(
        gameoflife.corners,
        "Have you created and exported a `printCell` function?"
      );

      const zeroCorners = ((gameoflife.corners || (() => ({topRight: [], bottomLeft: []})))()) || {topRight: [], bottomLeft: []};
      assert(
        gameoflife.same &&
          gameoflife.corners &&
          gameoflife.same(zeroCorners.topRight, [0, 0]),
        "Have you ensured that topRight is [0,0] if there are no living cells?"
      );
      assert(
        gameoflife.same &&
          gameoflife.corners &&
          gameoflife.same(zeroCorners.bottomLeft, [0, 0]),
        "Have you ensured that botomLeft is [0,0] if there are no living cells?"
      );

      assert(gameoflife.corners && corners.topRight, "");
      assert(gameoflife.corners && Array.isArray(corners.topRight), "");
      assert(gameoflife.corners && corners.topRight.length === 2, "");

      assert(
        gameoflife.same &&
          gameoflife.corners &&
          gameoflife.same(corners.topRight, [4, 3]),
        "Have you implemented a corners function that returns the correct top right coordinate?"
      );

      assert(gameoflife.corners && corners.bottomLeft, "");
      assert(gameoflife.corners && Array.isArray(corners.bottomLeft), "");
      assert(gameoflife.corners && corners.bottomLeft.length === 2, "");

      assert(
        gameoflife.same &&
          gameoflife.corners &&
          gameoflife.same(corners.bottomLeft, [1, 1]),
        "Have you implemented a corners function that returns the correct bottom left coordinate?"
      );

      var cornersNode;
      esprima.parseModule(source, {}, function(node) {
        if (
          (node.type === "VariableDeclarator" ||
            node.type === "FunctionDeclaration") &&
          node.id &&
          node.id.name === "corners"
        ) {
          cornersNode = node;
        }
      });
      assert(
        typeof cornersNode != "undefined" &&
          (cornersNode.params || cornersNode.init.params)[0].type ==
            "AssignmentPattern",
        "Have you provided a default value for the 'corners' function parameter?"
      );
    });
  });

  describe("Printing the game state", () => {
    it("Should have a printCells function. @printCells-function", () => {
      assert(
        gameoflife.printCells,
        "Have you created and exported a 'printCells' function?"
      );

      assert(
        typeof gameoflife.printCells([[3, 2]]) == "string",
        "Have you created a 'printCells' function that returns a string representation of the game state?"
      );
      assert(
        gameoflife.printCells([[3, 2]]) == "▣\n",
        "Have you created a 'printCells' function that prints '▣' for each living cell, '▢' for each non-living cell and a newline character at the end of each row?"
      );
      assert(
        gameoflife.printCells([
          [3, 2],
          [5, 2]
        ]) == "▣ ▢ ▣\n",
        "Have you created a 'printCells' function that prints '▣' for each living cell, '▢' for each non-living cell, a space in between each cell and a newline character at the end of each row?"
      );
      assert(
        gameoflife.printCells([
          [3, 2],
          [2, 3],
          [3, 3],
          [3, 4],
          [4, 4]
        ]) == "▢ ▣ ▣\n▣ ▣ ▢\n▢ ▣ ▢\n"
      );
    });
  });

  describe("Finding neighbors", () => {
    it("Should have a getNeighborsOf function. @getNeighborsOf-function", () => {
      assert(
        gameoflife.getNeighborsOf,
        "Have you created and exported a 'getNeighborsOf' function?"
      );

      const neighborsOf3Comma4 = gameoflife.getNeighborsOf([3, 4]) || [];

      assert(
        neighborsOf3Comma4.length === 8,
        "Have you created a function 'getNeighborsOf' that returns the eight neighbors of the given cell?"
      );

      assert(
        gameoflife.contains.call(neighborsOf3Comma4, [2, 4]) &&
          gameoflife.contains.call(neighborsOf3Comma4, [4, 4]) &&
          gameoflife.contains.call(neighborsOf3Comma4, [2, 3]) &&
          gameoflife.contains.call(neighborsOf3Comma4, [3, 3]) &&
          gameoflife.contains.call(neighborsOf3Comma4, [4, 3]) &&
          gameoflife.contains.call(neighborsOf3Comma4, [2, 5]) &&
          gameoflife.contains.call(neighborsOf3Comma4, [3, 5]) &&
          gameoflife.contains.call(neighborsOf3Comma4, [4, 5]),
        "Have you created a function 'getNeighborsOf' that returns the eight neighbors of the given cell?"
      );

      const neighborsOfNeg1Neg1 = gameoflife.getNeighborsOf([-1, -1]);

      assert(
        gameoflife.contains.call(neighborsOfNeg1Neg1, [-2, -1]) &&
          gameoflife.contains.call(neighborsOfNeg1Neg1, [0, -1]) &&
          gameoflife.contains.call(neighborsOfNeg1Neg1, [-2, -2]) &&
          gameoflife.contains.call(neighborsOfNeg1Neg1, [-1, -2]) &&
          gameoflife.contains.call(neighborsOfNeg1Neg1, [0, -2]) &&
          gameoflife.contains.call(neighborsOfNeg1Neg1, [-2, 0]) &&
          gameoflife.contains.call(neighborsOfNeg1Neg1, [-1, 0]) &&
          gameoflife.contains.call(neighborsOfNeg1Neg1, [0, 0]),
        "Have you created a function 'getNeighborsOf' that returns the eight neighbors of the given cell?"
      );
    });
  });

  describe("Finding living neighbors", () => {
    it("Should have a getLivingNeighbors function. @getLivingNeighbors-function", () => {
      assert(
        gameoflife.getLivingNeighbors,
        "Have you created and exported a 'getLivingNeighbors' function?"
      );

      const rPentomino = [
        [3, 2],
        [2, 3],
        [3, 3],
        [3, 4],
        [4, 4]
      ];

      const rPentominoNeighborsOfFourThree = gameoflife.getLivingNeighbors(
        [4, 3],
        rPentomino
      ) || [];

      assert(
        rPentominoNeighborsOfFourThree.length === 4,
        "Have you created a function 'getLivingNeighbors' that returns the living neighbors of the given cell?"
      );

      assert(
        gameoflife.contains.call(rPentominoNeighborsOfFourThree, [4, 4]) &&
          gameoflife.contains.call(rPentominoNeighborsOfFourThree, [3, 4]) &&
          gameoflife.contains.call(rPentominoNeighborsOfFourThree, [3, 3]) &&
          gameoflife.contains.call(rPentominoNeighborsOfFourThree, [3, 2]),
        "Have you created a function 'getLivingNeighbors' that returns the living neighbors of the given cell?"
      );

      assert(
        gameoflife.getLivingNeighbors([6, 6], rPentomino).length === 0,
        "Have you created a function 'getLivingNeighbors' that returns the living neighbors of the given cell?"
      );
    });
  });

  function containsAll(targets = [], state) {
    return targets.every(t => gameoflife.contains.call(state, t));
  }

  describe("Calculating a cell's future state", () => {
    it("Should have a willBeAlive function. @willBeAlive-function", () => {
      assert(
        gameoflife.willBeAlive,
        "Have you created and exported a 'willBeAlive' function?"
      );

      const rPentomino = [
        [3, 2],
        [2, 3],
        [3, 3],
        [3, 4],
        [4, 4]
      ];
      const cells = [
        [2, 4],
        [3, 4],
        [4, 4],
        [2, 3],
        [3, 3],
        [4, 3],
        [2, 2],
        [3, 2],
        [4, 2]
      ];
      const nextGen = cells.filter(c => gameoflife.willBeAlive(c, rPentomino));
      assert(
        nextGen.length === 6,
        "Have you created a 'willBeAlive' function that calculates if a cell will be alive in the next game state?"
      );
      assert(
        containsAll(
          [
            [2, 2],
            [3, 2],
            [2, 3],
            [2, 4],
            [3, 4],
            [4, 4]
          ],
          nextGen
        ),
        "Have you created a 'willBeAlive' function that calculates if a cell will be alive in the next game state?"
      );
    });
  });

  describe("Calculating the next state", () => {
    var start, next;
    before(() => {
      start = gameoflife.seed([3, 2], [2, 3], [3, 3], [3, 4], [4, 4]);
      next = gameoflife.calculateNext(start);
    });

    it("Should have a calculateNext function. @calculateNext-function", () => {
      assert(
        gameoflife.calculateNext,
        "Have you created and exported a 'calculateNext' function?"
      );

      assert(
        containsAll(
          [
            [2, 2],
            [3, 2],
            [2, 3],
            [2, 4],
            [3, 4],
            [4, 4]
          ],
          next
        ),
        "Have you created a 'calculateNext' function that calculates the next game state?"
      );
      const rPentominoPlusTwo = gameoflife.calculateNext(next);
      assert(
        containsAll(
          [
            [3, 5],
            [2, 4],
            [3, 4],
            [1, 3],
            [4, 3],
            [2, 2],
            [3, 2]
          ],
          rPentominoPlusTwo
        ),
        "Have you created a 'calculateNext' function that calculates the next game state?"
      );
    });
  });

  describe("Calculating multiple game states", () => {
    it("Should have an iterate function. @iterate-function", () => {
      assert(
        gameoflife.iterate,
        "Have you created and exported an 'iterate' function?"
      );

      const states = gameoflife.iterate([gameoflife.startPatterns.square], 2) || [];
      assert(
        states.length === 3,
        "Have you created an 'iterate' that calculates subsequent game states?"
      );
      assert(
        containsAll(gameoflife.startPatterns.square, states[0]),
        "Have you created an 'iterate' that calculates subsequent game states?"
      );
      assert(
        containsAll(gameoflife.startPatterns.square, states[1]),
        "Have you created an 'iterate' that calculates subsequent game states?"
      );
      assert(
        containsAll(gameoflife.startPatterns.square, states[2]),
        "Have you created an 'iterate' that calculates subsequent game states?"
      );

      const two = gameoflife.iterate(
        [
          [
            [1, 1],
            [2, 1],
            [1, 2]
          ]
        ],
        2
      );
      assert(
        two.length === 3,
        "Have you created an 'iterate' that calculates subsequent game states?"
      );
      assert(
        containsAll(
          [
            [1, 1],
            [2, 1],
            [1, 2],
            [2, 2]
          ],
          two[1]
        ),
        "Have you created an 'iterate' that calculates subsequent game states?"
      );
      assert(
        containsAll(
          [
            [1, 1],
            [2, 1],
            [1, 2],
            [2, 2]
          ],
          two[2]
        ),
        "Have you created an 'iterate' that calculates subsequent game states?"
      );

      const rPentominoNext = gameoflife.iterate(
        [gameoflife.startPatterns.rpentomino],
        2
      );
      assert(
        rPentominoNext.length === 3,
        "Have you created an 'iterate' that calculates subsequent game states?"
      );
      assert(
        containsAll(
          [
            [2, 2],
            [3, 2],
            [2, 3],
            [2, 4],
            [3, 4],
            [4, 4]
          ],
          rPentominoNext[1]
        ),
        "Have you created an 'iterate' that calculates subsequent game states?"
      );
      assert(
        containsAll(
          [
            [3, 5],
            [2, 4],
            [3, 4],
            [1, 3],
            [4, 3],
            [2, 2],
            [3, 2]
          ],
          rPentominoNext[2]
        ),
        "Have you created an 'iterate' that calculates subsequent game states?"
      );
    });
  });

  describe("Main function", () => {
    it("Should have a main function. @main-function", () => {
      assert(
        gameoflife.main,
        "Have you created and exported a 'main' function?"
      );

      // monkey patch console.log
      var results = "";
      var oldLogger = console.log;
      console.log = i => {
        results += i;
      };

      gameoflife.main("rpentomino", 2);

      assert(
        results ==
          "▢ ▣ ▣\n▣ ▣ ▢\n▢ ▣ ▢\n▣ ▣ ▣\n▣ ▢ ▢\n▣ ▣ ▢\n▢ ▢ ▣ ▢\n▢ ▣ ▣ ▢\n▣ ▢ ▢ ▣\n▢ ▣ ▣ ▢\n",
        "Have you created a 'main' function ?"
      );
      console.log = oldLogger;
    });
  });
});
