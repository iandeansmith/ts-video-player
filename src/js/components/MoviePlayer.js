
import { Lightning, Router, VideoPlayer, Registry } from "@lightningjs/sdk";

import PlayerButton from "./PlayerButton";
import PlayerControls from "./PlayerControls";
import { StageSize } from './const';
import { PB_ICON_CLOSE } from "./PlayerButton";

import { store } from '../store';

const CONTROLS_WIDTH = 900;
const OVERLAY_TIMEOUT = 5000;

export default class MoviePlayer extends Lightning.Component
{
    static _template()
    {
        return {
            Overlay: {
                alpha: 0,
                x: 0,
                y: 0,
                w: w => w,
                h: h => h,

                transitions: {
                    alpha: { duration: 3 },
                },

                Cover:
                {
                    color: 0xA0000000,
                    rect: true,
                    x: 0,
                    y: 0,
                    w: StageSize.width,
                    h: StageSize.height,
                },

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
        // the index of the overlay child that is currently in focus
        this.focusedChild = 1;

        // info about the movie being played
        this.movie = null;

        // is the control overlay active?
        this.overlayActive = false;

        // timeout id used to hide the overlay after X amount of seconds
        this.hideOverlayTimeout = 0;
    }

    _getFocused()
    {
        return this.overlayActive ? this.tag('Overlay').children[this.focusedChild] : this;
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
        else if (value >= this.tag('Overlay').children.length)
            value = this.tag('Overlay').children.length-1;

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

    _activateOverlay()
    {
        if (!this.overlayActive)
        {
            // display overlay
            this.overlayActive = true;
            this.tag('Overlay').transition('alpha').stop();
            this.tag('Overlay').patch({
                visible: true,
                alpha: 1,
            });

            // kill previous time out if present
            if (this.hideOverlayTimeout)
                Registry.clearTimeout(this.hideOverlayTimeout);

            // disable overlay after X amount of seconds
            this.hideOverlayTimeout = Registry.setTimeout(() => this._disableOverlay(), OVERLAY_TIMEOUT);
        }
    }

    _disableOverlay()
    {
        if (this.overlayActive)
        {
            // hide overlay
            this.overlayActive = false;
            this.tag('Overlay').setSmooth('alpha', 0);

            // clear timeout
            Registry.clearTimeout(this.hideOverlayTimeout);
            this.hideOverlayTimeout = 0;            
        }
    }

    _captureKey()
    {
        if (!this.overlayActive)
        {
            this._activateOverlay();
            return true;
        }
        else
        {
            return false;
        }
    }

    // signal sent from child controls to tell player to prevent auto timeout
    $lockPlayerOverlay(flag)
    {
        // don't need to do anything if the overlay is not actually active
        if (!this.overlayActive)
            return;

        // if true then disable the timeout 
        if (flag)
        {
            Registry.clearTimeout(this.hideOverlayTimeout);
            this.hideOverlayTimeout = 0;
        }
        // if false then restart the timeout
        else
        {
            this.hideOverlayTimeout = Registry.setTimeout(() => this._disableOverlay(), OVERLAY_TIMEOUT);
        }
    }

    _handleUp()
    {
        if (this.overlayActive)
            this._setFocusedChild(this.focusedChild-1);
    }

    _handleDown()
    {
        if (this.overlayActive)
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