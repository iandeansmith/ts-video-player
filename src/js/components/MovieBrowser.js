
import { Lightning, Utils } from "@lightningjs/sdk";
import axios from "axios";

import { store } from '../store';

import MovieList from './MovieList';
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
				color: 0xFF000000,
			},

			CurrentMovie: {
				type: CurrentMoviePoster,
				x: 0, y: 0, w: StageSize.width, h: StageSize.height,
			},

			Movies: {
				type: MovieList,
				show: false,
				x: 20, y: 20, w: StageSize.width - 40, h: 190,
				movies: [],
			},
		}
	}

	_getFocused()
	{
		return this.tag('Movies');
	}

	async _init()
	{
		// load movie list
		try
		{
			var result = await axios.get(Utils.asset('movies.json'));

			//store.dispatch(setMovieList(result.data.movies));
			store.setMovieList(result.data.movies);
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