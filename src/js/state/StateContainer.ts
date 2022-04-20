import StateDataReader from "./StateDataReader";

type SignalHandler<StateType> = (state: StateDataReader<StateType>) => void;
type ActionFunction<StateType> = (container: StateContainer<StateType>, state: StateType, payload: any) => void;
type MiddlewareFunction<StateType> = (container: StateContainer<StateType>, next: MiddlewareFunction<StateType>) => void;
type SequenceMethod<StateType> = (prevResult:any, context: SequenceContext<StateType>) => void;

interface SequenceContext<StateType>
{
    container: StateContainer<StateType>;
    payload: any;
    next: (error:any, result:any, params:SequenceContext<StateType>) => void;    
}

interface StateContainerParams<StateType>
{
    initialState: StateType;
    signals: Array<string>;
    actions: Record<string, ActionFunction<StateType>>;
    middleware?: Array<MiddlewareFunction<StateType>>;
    sequences?: Record<string, Array<SequenceMethod<StateType>>>;
}

export default class StateContainer<StateType>
{
    protected state: StateType;
    private _stateReader: StateDataReader<StateType>;
    private _validSignals: Array<string>;
    private _signalHandlers: Record<string, Array<SignalHandler<StateType>>> = {};
    private _actions: Record<string, ActionFunction<StateType>>;
    private _sequences: Record<string, Array<SequenceMethod<StateType>>>;

    constructor(args: StateContainerParams<StateType>)
    {
        // initialize state
        this.state = args.initialState;

        // add state reader
        this._stateReader = new StateDataReader(this.state);

        // add signals
        this._validSignals = [...args.signals];

        // add actions
        this._actions = { ...args.actions };

        // add sequences
        this._sequences = { ...args.sequences };
    }

    // broadcast a signal
    broadcastSignal(name: string)
    {
        // log error if signal not found
        if (!this._validSignals.includes(name))
        {
            console.error(`StateContainer: Invalid signal: ${name}`);
            return;
        }

        // execute all registered handlers
        for(let func of this._signalHandlers[name])
            func(this._stateReader);
    }

    // get a read only accessor to the state
    getState(): StateDataReader<StateType>
    {
        return this._stateReader;
    }

    // register a signal handler
    subscribe(signal:string, handler: SignalHandler<StateType>)
    {
        // initialize empty array on first subscription to this signal
        if (this._signalHandlers[signal] === undefined)
            this._signalHandlers[signal] = [];

        // add to list
        this._signalHandlers[signal].push(handler);

        // return unsubscriber
        return () => {
            let pos = this._signalHandlers[signal].indexOf(handler);
            if (pos >= 0)
                this._signalHandlers[signal].splice(pos, 1);
        }
    }

    // dispatch an action
    dispatch(actionName: string, payload: any)
    {
        // get action method
        let actionFunc = this._actions[actionName];

        // log an error if the action is not defined
        if (actionFunc === undefined)
        {
            console.error(`StateContainer: Undefined action: "${actionName}"`);
            return;
        }

        // otherwise execute it now
        actionFunc(this, this.state, payload);
    }

    // execute sequence
    async runSequence(sequenceName: string, payload: any)
    {
        let lastResult = null;
        const sequence = this._sequences[sequenceName];
        const context:SequenceContext<StateType> = {
            container: this,
            payload,
            next: (error, result, { container }) => {
            }
        };

        // do nothing if the sequence is not defined
        if (sequence == undefined)
        {
            console.error(`StateContainer: undefined sequence: ${sequenceName}`);
            return;
        }

        // execute each sequence function
        for(let i=0; i<sequence.length; i++)
        {
            let func = sequence[i];
            lastResult = await func(lastResult, context);
        }
    }
}