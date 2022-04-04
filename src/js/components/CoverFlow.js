
import { Lightning, Router } from '@lightningjs/sdk';

import CoverFlowItem from './CoverFlowItem';

//import { store } from '../store';
import MoviesContainer from '../store/MoviesContainer';

export default class CoverFlow extends Lightning.Component
{
    static _template()
    {
        return {
            Wrapper: {
                x: 0,
                y: 0,
                w: w => w,
                h: h => h,
                transitions: {
                    x: { duration: 1 }
                }
            }
        }
    }

    _init()
    {
        this._movies = [];
        this._scrollAnchor = 0.5;
        this._currentIndex = 0;
    }

    _gotoIndex(index)
    {
        var items = this.tag('Wrapper');

        // clamp index to 0 ... # of items
        if (index < 0)
            index = 0;
        else if (index >= this._movies.length)
            index = this._movies.length - 1;

        // save current index
        this._currentIndex = index;

        // reposition wrapper
        items.transition('x').stop();
        items.setSmooth('x', -(this._currentIndex*this.itemWidth));

        // notify each item so it can also animate itself
        for(var i=0; i<items.childList.length; i++)
        {
            items.childList.getAt(i).updatePosition(i, this._currentIndex, this.childList.length);
        }

        // set specified movie
        //store.setSelectedMovie(this._movies[this._currentIndex].id);
        MoviesContainer.dispatch('setSelectedMovie', { id: this._movies[this._currentIndex].id });
    }

    _handleLeft()
    {
        this._gotoIndex(this._currentIndex-1);
    }

    _handleRight()
    {
        this._gotoIndex(this._currentIndex+1);
    }

    _handleEnter()
    {
        var movie = this._movies[this._currentIndex];
        Router.navigate(`player/${movie.id}`);
    }

    _getFocused()
    {
        return this.tag('Wrapper').childList.getAt(this._currentIndex);
    }

    setMovies(movies)
    {
        var wrapper = this.tag('Wrapper');
        var items = wrapper.childList;
        var itemWidth = this.itemWidth;
        var x = (this._scrollAnchor * this.w) - (itemWidth / 2);

        // save movie list internally
        this._movies = [...movies];

        // resize wrapper
        wrapper.patch({ w: itemWidth * this._movies.length });

        // clear children
        items.clear();

        // generate movie items
        for(let movie of movies)
        {
            items.add({
                type: CoverFlowItem,
                movie: movie,
                x: x,
                y: 0,
                w: itemWidth,
                h: this.h,
            });

            x += itemWidth;
        }

        this._gotoIndex(0);
    }
}
