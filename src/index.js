import React from 'react';
import ReactDOM from 'react-dom';
import { flatten, pickBy, keys } from 'lodash';
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
        this._state = { ...this._state, ...val };
    }

    get state() {
        return this._state;
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

const CellCMP = ({ x, y, fuel, updateGridCell, ...props }) => (
    <div
        className={'cell ' + keys(pickBy(props.state, v => v))}
        onClick={() => updateGridCell('state', { burning: true })}
        onDoubleClick={() => console.log({ x, y, ...props })}
    >
        <code>
            {x}, {y}
            <p>{fuel}</p>
        </code>
    </div>
);

class App extends React.Component {
    state = {
        g
    };

    updateGridCell = (x, y) => (key, value) => {
        this.setState(
            set(lensPath(['g', 'grid', y, x, key]), value, this.state)
        );
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
