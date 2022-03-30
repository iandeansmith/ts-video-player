
import StateObject from '../state/StateObject';

// individual movie info
export interface MovieInfo
{
    id: number;
    title: string;
    thumbnail: string;
    poster: string;
    video: string;
}

// core application state
export interface VideoPlayerState 
{
    movies: Record<number, MovieInfo>;
    movieIds: Array<number>;
    selectedMovie: MovieInfo;   
}

// application state container
class MoviesState extends StateObject<VideoPlayerState>
{
    constructor()
    {
        super({
            movies: {},
            movieIds: [],
            selectedMovie: null,
        });
    }

    // convenience generator function to produce an array of movies 
    *movieList(): Iterable<MovieInfo>
    {
        for(let id in this._state.movieIds)
            yield this._state.movies[id];
    }

    // replace the current list of movies
    setMovieList(list:Array<MovieInfo>)
    {
        var vps:VideoPlayerState = this._state;
        var ids: Array<number> = [];
        var movies: Record<number, MovieInfo> = {};
    
        ids = list.map(m => {
            let id = m.id;
            movies[id] = { ...m };
            return id;
        });
    
        this._state.movies = movies;
        this._state.movieIds = ids;

        this.notifyChanged('movieList');
    }

    // set the currently selected movie
    setSelectedMovie(id:number)
    {
        if (this._state.movies[id] !== undefined)
        {
            this._state.selectedMovie = this._state.movies[id];
            this.notifyChanged('selectedMovie');
        }
    }

    // clear the currently selected movie
    clearSelectedMovie()
    {
        this._state.selectedMovie = null;
        this.notifyChanged('selectedMovie');
    }
}

export const store = new MoviesState();