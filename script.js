const GRID_SIZE = 20;
let start = null;
let end = null;
let isSettingStart = false;
let isSettingEnd = false;

// Initialize grid
const grid = document.getElementById('grid');
for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.setAttribute('id', `${i}-${j}`);
        cell.addEventListener('click', () => toggleCell(cell));
        grid.appendChild(cell);
    }
    grid.appendChild(document.createElement('br'));
}

function toggleCell(cell) {
    if (isSettingStart) {
        if (start) start.classList.remove('start');
        start = cell;
        start.classList.add('start');
        isSettingStart = false;
    } else if (isSettingEnd) {
        if (end) end.classList.remove('end');
        end = cell;
        end.classList.add('end');
        isSettingEnd = false;
    } else {
        cell.classList.toggle('obstacle');
    }
}

document.getElementById('startBtn').addEventListener('click', () => {
    isSettingStart = true;
    isSettingEnd = false;
});

document.getElementById('endBtn').addEventListener('click', () => {
    isSettingStart = false;
    isSettingEnd = true;
});

document.getElementById('visualizeBtn').addEventListener('click', () => {
    if (!start || !end) return;
    visualizeBFS();
});

function visualizeBFS() {
    const queue = [{ node: start, parent: null }];
    const visited = new Set();
    const path = new Map();

    while (queue.length > 0) {
        const { node, parent } = queue.shift();
        visited.add(node);
        if (node === end) {
            reconstructPath(path, node);
            return;
        }

        const neighbors = getNeighbors(node);
        for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                queue.push({ node: neighbor, parent: node });
                path.set(neighbor, node);
                neighbor.classList.add('visited');
            }
        }
    }
}


function getNeighbors(cell) {
    const [x, y] = cell.getAttribute('id').split('-').map(Number);
    const neighbors = [];
    if (x > 0) neighbors.push(document.getElementById(`${x - 1}-${y}`));
    if (x < GRID_SIZE - 1) neighbors.push(document.getElementById(`${x + 1}-${y}`));
    if (y > 0) neighbors.push(document.getElementById(`${x}-${y - 1}`));
    if (y < GRID_SIZE - 1) neighbors.push(document.getElementById(`${x}-${y + 1}`));
    return neighbors.filter(neighbor => !neighbor.classList.contains('obstacle'));
}

function reconstructPath(path, current) {
    while (current !== start) {
        current.classList.add('path');
        current = path.get(current);
    }
}
