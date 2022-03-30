
// wrap an object up to force it to be read only
// this keeps functions outside of StateObject implementations from modifying the state
class StateDataReader<StateType>
{
    private _stateData: StateType;

    constructor(src: StateType)
    {
        this._stateData = src;

        for(let key in src)
        {
            Object.defineProperty(this, key, {
                get: () => this._stateData[key],
                set: (value) => {},
            });
        }
    }
}


export default class StateObject<StateType>
{
    // internal state
    protected _state: StateType;

    // state reader
    private _stateReader: StateDataReader<StateType>;

    // change listeners
    private _listeners: Record<string, Array<Function>> = {};

    constructor(initial: StateType)
    {
        this._state = initial;
        this._stateReader = new StateDataReader(this._state);
    }

    get state(): StateDataReader<StateType>
    {
        return this._stateReader;
    }

    // subscribe a listener for a field change
    subscribe(field: string, callback: Function): Function
    {
        // add empty list it none exists
        if (this._listeners[field] == undefined)
            this._listeners[field] = [];

        // add to subscriber list
        this._listeners[field].push(callback);

        // return function to unsub
        return () => delete this._listeners[field];
    }

    // notify that a field or fields have changed
    protected notifyChanged(value: string | Array<string>)
    {
        // if value is a string look for registered listeners
        if (typeof value === "string" && this._listeners[value] != undefined)
        {
            for(let callback of this._listeners[value])
                callback(this._stateReader);
        }
        // run this function against every string in value
        else if (value instanceof Array)
        {
            for(let field of value)
                this.notifyChanged(field);
        }
    }
}