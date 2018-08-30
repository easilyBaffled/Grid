import React from 'react';
import ReactDOM from 'react-dom';
import { flatten } from 'lodash';

import './styles.css';

console.ident = v => (console.log(v), v);

class Cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Grid {
    constructor(width, height) {
        document.documentElement.style.setProperty('--cells-per-row', width);
        this.grid = Array.from({ length: height }, (_, y) =>
            Array.from({ length: width }, (__, x) => new Cell(x, y))
        );
    }
}

const g = new Grid(6, 4);

const CellCMP = ({ x, y }) => (
    <div className="cell">
        <code>
            {x}, {y}
        </code>
    </div>
);
console.log(g.grid, flatten(g.grid));
const App = () => (
    <div className="board">
        {flatten(g.grid).map(cell => <CellCMP {...cell} />)}
    </div>
);

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
