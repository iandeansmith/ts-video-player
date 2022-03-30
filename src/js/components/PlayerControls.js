
import { Lightning, VideoPlayer } from "@lightningjs/sdk";

import PlayerProgressBar from './PlayerProgressBar';
import PlayerButton from "./PlayerButton";
import { PB_ICON_PAUSE, PB_ICON_PLAY } from "./PlayerButton";

export default class PlayerControls extends Lightning.Component
{
	static _template()
	{
		return {
			Layout: {
				x: 0,
				y: 0,
				w: w => w,
				h: h => h,

				flex: {
					padding: 0,
					justifyContent: 'center'
				},

				PlaybackButton: {
					type: PlayerButton,
					visible: true,
					h: 100,
					w: 100,
					flexItem: {
						marginRight: 20,
					},
					signals: {
						pressed: '_onTogglePlayback',
					}
				},

				Progress: {
					type: PlayerProgressBar,
					w: 780,
				},
			}
		}
	}

	_onTogglePlayback()
	{
		VideoPlayer.playPause();
	}

	setPlaying(flag)
	{
		var button = this.tag('PlaybackButton');

		if (flag)
		{
			button.setIconType(PB_ICON_PAUSE);
		}
		else
		{
			button.setIconType(PB_ICON_PLAY);
		}
	}

	setProgress(value)
	{
		this.tag('Progress').setProgress(value);
	}

	_init()
	{
		this.focusedChild = 0;
	}

	_handleLeft()
	{
		this.focusedChild--;
		
		if (this.focusedChild < 0)
			this.focusedChild = 0;

		return true;
	}

	_handleRight()
	{
		var tag = this.tag('Layout');

		this.focusedChild++;
		
		if (this.focusedChild >= tag.children.length)
			this.focusedChild = tag.children.length-1;

		return true;
	}

	_getFocused()
	{
		return this.tag('Layout').children[this.focusedChild];
	}
}