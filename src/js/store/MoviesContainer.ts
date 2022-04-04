
import StateContainer from '../state/StateContainer';

interface MovieInfo
{
    id: number;
    title: string;
    thumbnail: string;
    poster: string;
    video: string;
}

interface MoviesState 
{
    movies: Record<number, MovieInfo>;
    selectedMovie: MovieInfo;
}

export default new StateContainer<MoviesState>({
    signals: ['movieSelected', 'movieListUpdated'],
    initialState: {
        movies: {},
        selectedMovie: null,
    },
    actions: {
        setMovieList(state:MoviesState, payload:any)
        {
            let { list } = payload;
            for(var obj of list)
                state.movies[obj.id] = obj;

            this.broadcastSignal('movieListUpdated');
        },

        setSelectedMovie(state:MoviesState, payload:any)
        {
            let { id } = payload;

            if (state.movies[id] !== undefined)
                state.selectedMovie = state.movies[id];

            this.broadcastSignal('movieSelected');
        },
    }
});