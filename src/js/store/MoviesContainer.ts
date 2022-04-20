
import { container } from 'webpack';
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
        setMovieList(container, state, payload)
        {
            let { list } = payload;
            for(var obj of list)
                state.movies[obj.id] = obj;

            container.broadcastSignal('movieListUpdated');
        },

        setSelectedMovie(container, state, payload)
        {
            let { id } = payload;

            if (state.movies[id] !== undefined)
                state.selectedMovie = state.movies[id];

            container.broadcastSignal('movieSelected');
        },
    },
});