document.addEventListener('DOMContentLoaded', e => {
    const w = 20;
    const h = 20;
    const life = new Life(w, h, '#board');

    let gameOn = false;
    document.getElementById('start-btn').addEventListener('click', e => {
        gameOn = true;
        setInterval(_ => {
            if(gameOn){
                life.nextGeneration();
            }
        }, 80);
    });
    document.getElementById('stop-btn').addEventListener('click', e => {
        gameOn = false;
    });
});


class Life {
    constructor(w, h, boardSelector){
        const rows = [];
        const cells = {};
        
        for(let i = 0; i < h; i++){
            let row = document.createElement('tr');
            for(let j = 0; j < w; j++){
                const cell = document.createElement('td');
                cell.classList.add('dead');
                const xyStr = `${j}:${i}`;
                cell.addEventListener('click', e => {
                    cells[xyStr].changeState();
                });
                row.append(cell);
                cells[xyStr] = new Cell(0, cell);
            }
            rows.push(row)
        }

        this.cells = cells;
        const board = document.querySelector(boardSelector);
        for(let row of rows){
            board.append(row);
        }
    }

    // создать следующее поколение
    nextGeneration(){
        this._applyUpdates(this._getUpdates());
    }

    // получение списка клеток, состояние которых нужно изменить в след. поколении
    _getUpdates(){
        const updates = [];
        for(let s in this.cells){
            const cell = this.cells[s]
            const xy = s.split(':');
            const x = Number(xy[0]);
            const y = Number(xy[1]);

            // перебор соседей клетки
            const neighbors = [
                {x: x-1, y: y-1}, {x: x, y: y-1}, {x: x+1, y: y-1},
                {x: x-1, y: y}, {x: x+1, y: y},
                {x: x-1, y: y+1}, {x: x, y: y+1}, {x: x+1, y: y+1},
            ];
            let statesSum = 0; // сумма состояний соседей
            for(let n of neighbors){
                const neighbor = this.cells[`${n.x}:${n.y}`];
                if(neighbor !== undefined){
                    statesSum += neighbor.state;
                } 
            }
            if(cell.state === 1){
                if(statesSum < 2 || statesSum > 3){
                    updates.push(s);
                }
            } else {
                if(statesSum === 3){
                    updates.push(s);
                }
            }                
        }

        return updates;       
    }

    // применение обновлений к карте состояний
    _applyUpdates(updates){
        for(let c of updates){
            this.cells[c].changeState();
        }
    }
}


// клетка
class Cell {
    constructor(state, td){
        this.state = state; // состояние, 0 - мертвая, 1 - живая
        this.td = td; // соответствующий td-элемент 
    }

    // смена состояния и изменение соотв. элемента
    changeState(){
        const s = this.state;
        this.state = s === 0 ? 1 : 0;
        const classList = this.td.classList;
        if(classList.contains('dead')){
            classList.replace('dead', 'live');
        } else {
            classList.replace('live', 'dead');
        }
    }
}

