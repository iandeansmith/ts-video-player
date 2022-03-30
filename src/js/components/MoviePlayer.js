
import { Lightning, Router, VideoPlayer } from "@lightningjs/sdk";

import PlayerButton from "./PlayerButton";
import PlayerControls from "./PlayerControls";
import { StageSize } from './const';
import { PB_ICON_CLOSE } from "./PlayerButton";

import { store } from '../store';

const CONTROLS_WIDTH = 900;


export default class MoviePlayer extends Lightning.Component
{
    static _template()
    {
        return {
            CloseButton: {
                type: PlayerButton,
                iconType: PB_ICON_CLOSE,
                x: 20,
                y: 20,
                w: 50,
                h: 50,
                signals: {
                    pressed: '_onBackPressed'
                }
            },

            Controls: {
                type: PlayerControls,
                x: (StageSize.width / 2) - (CONTROLS_WIDTH / 2),
                y: StageSize.height - 150,
                w: CONTROLS_WIDTH,
                h: 100
            },
        }
    }

    set params(args)
    {
        this.movieId = args.id;
    }

    _startMovie()
    {
        this.movie = store.state.selectedMovie;
        VideoPlayer.open(this.movie.video);
    }

    _init()
    {
        this.focusedChild = 1;
        this.movie = null;
        this.paused = false;
    }

    _getFocused()
    {
        return this.children[this.focusedChild];
    }

    _firstActive()
    {
        VideoPlayer.consumer(this);
        VideoPlayer.size(StageSize.width, StageSize.height);
    }

    _setFocusedChild(value)
    {
        if (value < 0)
            value = 0;
        else if (value >= this.children.length)
            value = this.children.length-1;

        this.focusedChild = value;
    }

    _enable()
    {
        this._startMovie();
    }

    _disable()
    {
        VideoPlayer.clear();
    }

    _handleUp()
    {
        this._setFocusedChild(this.focusedChild-1);
    }

    _handleDown()
    {
        this._setFocusedChild(this.focusedChild+1);
    }

    _onBackPressed()
    {
        Router.back();
    }

    $videoPlayerPause()
    {
        this.tag('Controls').setPlaying(false);
    }

    $videoPlayerPlaying()
    {
        this.tag('Controls').setPlaying(true);
    }

    $videoPlayerTimeUpdate()
    {
        var percent = VideoPlayer.currentTime / VideoPlayer.duration;
        this.tag('Controls').setProgress(percent);
    }
}