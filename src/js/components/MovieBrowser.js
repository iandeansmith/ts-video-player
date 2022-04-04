
import { Lightning, Utils } from "@lightningjs/sdk";
import axios from "axios";

//import { store } from '../store';
import MoviesContainer from '../store/MoviesContainer';

import MovieList from './MovieList';
import CoverFlow from "./CoverFlow";
import CurrentMoviePoster from "./CurrentMoviePoster";
import { StageSize } from './const';

export default class MovieBrowser extends Lightning.Component
{
	static getFonts() 
	{
		return [{ family: 'Regular', url: Utils.asset('fonts/Roboto-Regular.ttf') }]
	}
	
	static _template()
	{
		return {
			BG: {
				rect: true,
				x: 0, y: 0, w: StageSize.width, h: StageSize.height,
				color: 0xFFCCCCCC,
			},

			CurrentMovie: {
				type: CurrentMoviePoster,
				x: 0, y: 0, w: StageSize.width, h: StageSize.height,
			},

			Movies: {
				type: CoverFlow,
				x: 0, y: 50, w: StageSize.width, h: 400,
				itemWidth: StageSize.width / 5,
			},
		}
	}

	_getFocused()
	{
		return this.tag('Movies');
	}

	_enable()
	{
		//this.unsubFromStore = store.subscribe('movieList', (state) => {
		this.unsubFromStore = MoviesContainer.subscribe('movieListUpdated', (state) => {
			var movies = Object.values(state.movies);
			this.tag('Movies').setMovies(movies);
		});
	}

	_disable()
	{
		if (this.unsubFromStore)
			this.unsubFromStore();
	}

	async _init()
	{
		// load movie list
		try
		{
			var result = await axios.get(Utils.asset('movies.json'));

			//store.dispatch(setMovieList(result.data.movies));
			MoviesContainer.dispatch('setMovieList', { list: result.data.movies });
		}
		catch(err)
		{
			if (err.isAxiosError)
				alert(err.message);
			else
				throw err;
		}
	}
}