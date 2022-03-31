
import { Img, Lightning, Utils, Colors } from "@lightningjs/sdk";

import { store } from '../store';
import { StageSize } from "./const";

export default class CurrentMoviePoster extends Lightning.Component
{
    static _template()
    {
        return {
            // used to fade out over
            BgImage: {
                //visible: false,
                x: 0,
                y: 0,
                w: w => w,
                h: h => h,
            },

            // current poster image
            PosterImage: {
                alpha: 0,
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
                alpha: 0,
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
            let titleY = title.finalY;
            let texture = Img(Utils.asset(info.poster)).cover(StageSize.width, StageSize.height);
            texture.options.type = 'cover'; 

            // save info
            this.currentMovie = { ...info };

            // set bg texture
            this.tag('BgImage').patch({
                texture: poster.texture,
            });

            // update poster image
            poster.patch({ texture });
            this.posterAnim.stop();
            this.posterAnim.start();

            // update title
            title.patch({ 
                text: { text: this.currentMovie.title },
            });

            this.titleAnim.finish();
            this.titleAnim.start();
        }
    }

    _init()
    {
        this.currentMovie = null;

        this.posterAnim = this.tag('PosterImage').animation({
            duration: 0.25,
            repeat: 0,
            stopMethod: 'forward',
            actions: [
                {
                    p: 'alpha',
                    v: { 0: 0, 1: 1 },
                }
            ]
        });

        this.titleAnim = this.tag('Title').animation({
            duration: 0.7,
            repeat: 0,
            stopMethod: 'forward',
            actions: [
                {
                    p: 'alpha',
                    v: { 0: 0, 1: 1 },
                },
                {
                    p: 'x',
                    v: {
                        0: 80,
                        1: 40
                    }
                }
            ]
        });
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