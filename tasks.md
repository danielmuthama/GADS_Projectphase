## Add a `seed` Function

In `gameoflife.js` add a function named `seed` that returns its arguments in an array. That is, if the function is called with three arguments (`seed(a,b,c)`) it should return an array containing the three arguments (`[a,b,c]`). Use the `arguments` object to achieve this. Ensure that the function `seed` is exported from the module.

## Add a `same` Function

We need to be able to test if two cells are the same. Add a function named `same` that accepts two cells (a cell is represented as an array with two integer values) and returns a boolean indicating if the two cells are the same. Ensure that `same` is exported from the module.

## Add a `contains` Function

The game state of the cells is represented by an array containing all living cells. E.g. `[[3,4], [4,4]]`. All other cells are not alive. 

Add a function named `contains` that tests if the supplied cell is alive in the passed game state. The cell to test for must be passed as a function parameter. The game state must be passed as the `this` value within the `contains` function. Ensure that `contains` is exported from the module.

## Add a `sum` Function

Add a single-line arrow function function named `sum` that adds together two cells. The first coordinate of the result is the sum of the first coordinates of the two summed cells. The second coordinate of the result is the sum of the second coordinates of the two summed cells. That is, [a,b] + [c,d] = [a+c, b+d]. Ensure that `sum` is exported from the module.