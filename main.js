/**
 * Make a new cell grid that is width & height in dimensions.
 * @param width The width of the grid.
 * @param height The height of the grid.
 * @returns {Uint8Array[]} An array containing the grid and the generation cell grid.
 */
function makeCellGrid(width, height) {

	const cells = new Uint8Array(width * height);

	const generationBuffer = new Uint8Array(width * height);

	for (let i = 0; i < cells.length; ++i) {
		cells[i] = Math.random() <= 0.25 ? 1 : 0;
	}

	return [cells, generationBuffer];
}

/**
 * Gets the x/y position of the cell within the grid.
 * @param x The x position.
 * @param y The y position.
 * @param width The width of the grid.
 * @returns {number} The position within the grid.
 */
function getCellIndex(x, y, width) {
	return x + width * y;
}

/**
 * Wraps the value around {0, max} if the value sits outside the bounds.
 * For example, -1 would become max and max would become 0.
 * @param val The value to wrap.
 * @param max The max limit the value can be.
 * @returns {number} The wrapped value.
 */
function wrap(val, max) {
	if (val < 0) {
		val = (max - Math.abs(val));
	}

	if (val > max) {
		val = Math.abs((max - val));
	}

	return val;

}

/**
 * Get state of the cell that lives at the x/y position in the grid.
 * @param cells The grid of cells.
 * @param x The x position.
 * @param y The y position
 * @param width The width of the grid.
 * @param height The height of the grid.
 * @returns {number} The state of the cell.
 */
function getCell(cells, x, y, width, height) {
	let newX = wrap(x, width);

	let newY = wrap(y, height);

	return cells[getCellIndex(newX, newY, width)];
}

/**
 * Check if the cell at position x/y is alive for the next generation.
 * @param cells The grid of cells.
 * @param x The x position.
 * @param y The y position.
 * @param width The width of the grid.
 * @param height The height of the grid.
 * @returns {boolean} true if the cell is still alive, false otherwise.
 */
function isAlive(cells, x, y, width, height) {

	let count = 0;

	const index = getCellIndex(x, y, width);

	const alive = cells[index] === 1;

	for (let neighbourY = -1; neighbourY <= 1; ++neighbourY) {

		for (let neighbourX = -1; neighbourX <= 1; ++neighbourX) {

			// Don't include the currently processed cell.
			if (neighbourX === 0 && neighbourY === 0) {
				continue;
			}

			const neighbourAlive = getCell(
				cells,
				x + neighbourX,
				y + neighbourY,
				width,
				height
			);

			count += neighbourAlive;

		}
	}

	return (alive && count === 2) || count === 3;
}

/**
 * Update the next generation of cells
 * @param cells The current generation of cells.
 * @param nextGeneration The next generation of cells.
 * @param width The width of the cell grid.
 * @param height The height of the cell grid.
 */
function updateCells(cells, nextGeneration, width, height) {


	for (let y = 0; y < height; ++y) {

		for (let x = 0; x < width; ++x) {

			nextGeneration[getCellIndex(x, y, width)] = isAlive(cells, x, y, width, height) ? 1 : 0;
		}

	}

}

function update(cells, nextGeneration, context, width, height) {

	updateCells(cells, nextGeneration, width, height);

	render(cells, context, width, height);

	// Now this generation is rendered, we update to the next generation
	for (let i = 0; i < nextGeneration.length; ++i) {
		cells[i] = nextGeneration[i];
	}

	requestAnimationFrame(function () {
		update(cells, nextGeneration, context, width, height);
	});
}

function render(cells, context, width, height) {

	context.fillStyle = "white";

	context.clearRect(0, 0, width, height);

	for (let y = 0; y < height; ++y) {

		for (let x = 0; x < width; ++x) {

			if (getCell(cells, x, y, width, height) === 1) {

				context.fillStyle = "blue";

				context.fillRect(x, y, 1, 1);
			}

		}

	}
}

function main() {

	const canvas = document.getElementById('canvas');

	const context = canvas.getContext('2d');

	const width = canvas.width = window.innerWidth / 2;

	const height = canvas.height = window.innerHeight / 2;

	const [cells, nextGeneration] = makeCellGrid(width, height);

	update(cells, nextGeneration, context, width, height);
}

main();