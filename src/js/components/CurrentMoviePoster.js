
import { Img, Lightning, Utils, Colors } from "@lightningjs/sdk";

import { store } from '../store';
import { StageSize } from "./const";

export default class CurrentMoviePoster extends Lightning.Component
{
    static _template()
    {
        return {
            PosterImage: {
                //texture: Img(Utils.asset('images/newhope.jpg')).cover(1920, 1080),
                visible: false,
                x: 0,
                y: 0,
                w: w => w,
                h: h => h,
            },

            Cover: {
                color: 0x7F000000,
                rect: true,
                x: 0,
                y: 0,
                w: w => w,
                h: h => h,
            },

            Title: {
                visible: false,
				x: 40,
				y: h => h - 80,
				text: {
					fontSize: 36,
                    shadow: true,
					text: '<movie name>',
					textColor: 0xFFFFFFFF,
				},
            }
        }
    }

    _setMovie(info)
    {
        var poster = this.tag('PosterImage');
        var title = this.tag('Title');

        // if the incoming movie is null
        if (info == null)
        {
            // clear the current movie
            this.currentMovie = null;

            // hide the poster
            poster.patch({ visible: false });
            title.patch({ visible: false });
        }
        // otherwise if the ID does not match the current then refresh the poster image
        else if (this.currentMovie == null || info.id != this.currentMovie.id)
        {
            let texture = Img(Utils.asset(info.poster)).cover(StageSize.width, StageSize.height);
            texture.options.type = 'cover'; 

            // save info
            this.currentMovie = { ...info };

            // update poster image
            poster.patch({
                texture,
                visible: true,
            });

            title.patch({ 
                text: { text: this.currentMovie.title },
                visible: true,
            });
        }
    }

    _init()
    {
        this.currentMovie = null;
    }

    _enable()
    {
        // respond to state changes
        this.unsubStore = store.subscribe('selectedMovie', (state) => {
            this._setMovie(state.selectedMovie);
        });
    }

    _disable()
    {
        if (this.unsubStore != null)
            this.unsubStore();
    }
}