document.addEventListener('DOMContentLoaded', e => {
    let w = 50;
    let h = 50;

    let cells = {};
    let stateMatrix = [];

    for(let i = 0; i < h; i++){
        let row = document.createElement('tr');
        stateMatrix[i] = [];
        for(let j = 0; j < w; j++){
            const cell = document.createElement('td');
            cell.classList.add('dead');
            cell.setAttribute('data-xy', `${j}:${i}`);
            cells[`${j}:${i}`] = cell;
            cell.addEventListener('click', e => {
                const c = e.target;
                _killOrCreate(c);
            });
            row.append(cell);
            stateMatrix[i][j] = 0;
        }
        document.getElementById('board').append(row);
    }

    let gameOn = false;
    document.getElementById('start-btn').addEventListener('click', e => {
        gameOn = true;
        setInterval(_ => {
            if(gameOn){
                life();
            }
        }, 80);
    });
    document.getElementById('stop-btn').addEventListener('click', e => {
        gameOn = false;
    });


    const life = _ => {
        const p = processStateMatrix(stateMatrix);
        stateMatrix = p[0];
        const updates = p[1];
        applyUpdates(updates, cells);
    }

    const processStateMatrix = (smatrix) => {
        const updates = [];
        const updatedMatrix = [];
        smatrix.forEach((row, y) => {
            updatedMatrix[y] = [];
            row.forEach((value, x) => {
                updatedMatrix[y][x] = value;
                const n = _getNeighborsStatesSum(x, y, smatrix);
                const xyStr = `${x}:${y}`;
                if(value === 1){
                    if(n < 2 || n > 3){
                        updatedMatrix[y][x] = 0;
                        updates.push(xyStr);
                    }
                } else {
                    if(n === 3){
                        updatedMatrix[y][x] = 1;
                        updates.push(xyStr);
                    }
                }
            });
        });

        return [updatedMatrix, updates];
    }

    const applyUpdates = (updates, cells) => {
        for(let u of updates){
            const c = cells[u];
            if(c.classList.contains('dead')){
                _create(c);
            } else {
                _kill(c);
            }                
        }
    }

    const getCellCoords = (cell) => {
        let xy = cell.getAttribute('data-xy');
        xy = xy.split(':');
        return {x: Number(xy[0]), y: Number(xy[1])};
    }

    const _getNeighborsStatesSum = (x, y, smatrix) => {
        const neighbors = [
            {x: x-1, y: y-1}, {x: x, y: y-1}, {x: x+1, y: y-1},
            {x: x-1, y: y}, {x: x+1, y: y},
            {x: x-1, y: y+1}, {x: x, y: y+1}, {x: x+1, y: y+1},
        ];
        let statesSum = 0;
        for(let n of neighbors){
            try {
                smatrix[n.y][n.x];
            } catch {
                continue;
            }
            statesSum += smatrix[n.y][n.x];;
        }
        return statesSum;
    }

    const _kill = (c) => {
        c.classList.replace('live', 'dead');
    }

    const _create = (c) => {
        c.classList.replace('dead', 'live');
    }

    const _killOrCreate = c => {
        const {x, y} = getCellCoords(c);
        if(c.classList.contains('dead')){
            _create(c);
            stateMatrix[y][x] = 1;
        } else {
            _kill(c);
            stateMatrix[y][x] = 0;
        }
    }
});