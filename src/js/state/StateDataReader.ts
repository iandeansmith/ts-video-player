// wrap an object up to force it to be read only
// this keeps functions outside of StateObject implementations from modifying the state
export default class StateDataReader<StateType>
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