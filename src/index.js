import React from 'react';
import ReactDOM from 'react-dom';
import { flatten } from 'lodash';
import { lensPath, set, view } from 'ramda';
import './styles.css';

console.ident = v => (console.log(v), v);

const stateResolvers = {
    // state name: resolverFunction
    burning: obj =>
        obj.fuel > 0
            ? { ...obj, fuel: obj.fuel - 1 }
            : { ...obj, burning: false }
};

class Cell {
    constructor({
        fuel = Math.round(Math.random() * 10),
        state = {},
        ...props
    }) {
        Object.assign(this, { fuel, state }, props);
    }
    updateCell = (key, value) => new Cell(...this, { [key]: value });

    set state(val) {
        console.log('setting state', val);
        // this.state = val;
    }
}

class Grid {
    constructor(width, height = width) {
        document.documentElement.style.setProperty('--cells-per-row', width);
        this.grid = Array.from({ length: height }, (_, y) =>
            Array.from({ length: width }, (__, x) => new Cell({ x, y }))
        );
    }

    getCell = (x, y) => this.grid[y][x];
}

const g = new Grid(5);

const CellCMP = ({ x, y, updateGridCell, ...props }) => (
    <div
        className="cell"
        onClick={() => updateGridCell('state', { burning: true })}
        onDoubleClick={() => console.log({ x, y, ...props })}
    >
        <code>
            {x}, {y}
        </code>
    </div>
);

class App extends React.Component {
    state = {
        g
    };

    updateGridCell = (x, y) => (key, value) => {
        console.log(key, view(lensPath(['grid', y, x]), this.state.g));
        // const cell = view(lensPath(['grid', y, x]), this.state.g);
        // console.log( cell )
        // const updatedCell = cell.updateCell( key, value );
        console.log(set(lensPath(['grid', y, x, key]), value, this.state.g));
    };
    render() {
        return (
            <div className="board">
                {flatten(this.state.g.grid).map(cell => (
                    <CellCMP
                        {...cell}
                        g={this.state.g}
                        updateGridCell={this.updateGridCell(cell.x, cell.y)}
                    />
                ))}
            </div>
        );
    }
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
