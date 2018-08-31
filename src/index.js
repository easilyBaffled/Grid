import React from 'react';
import ReactDOM from 'react-dom';
import { flatten, pickBy, keys } from 'lodash';
import { lensPath, set, view } from 'ramda';
import './styles.css';

console.ident = v => (console.log(v), v);

const stateResolvers = {
    // state name: resolverFunction
    burning: cell =>
        console.ident(cell).fuel > 0
            ? cell.update('fuel', cell.fuel - 1)
            : (cell.state = { burning: false })
};

const getActiveStates = state => keys(pickBy(state, v => v));

class Cell {
    constructor({
        fuel = Math.round(Math.random() * 10),
        state = {},
        ...props
    }) {
        console.log(props);
        Object.assign(this, { fuel, state }, props);
    }

    update(key, value) {
        return new Cell(...this, { [key]: value });
    }

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

const g = new Grid(2);

const CellCMP = ({ x, y, fuel, updateGridCell, ...props }) => (
    <div
        className={'cell ' + getActiveStates(props.state).join(' ')}
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

    tick = () => {
        this.setState();
        const newGrid = this.state.g.grid.map(row =>
            row.map(cell =>
                getActiveStates(cell.state).reduce(
                    (c, activeState) => stateResolvers[activeState](c),
                    cell
                )
            )
        );
        console.log(newGrid);
        this.setState(set(lensPath(['g', 'grid']), newGrid, this.state));
    };

    componentDidUpdate() {
        setTimeout(this.tick, 1000);
    }

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
