
import { Lightning, VideoPlayer } from "@lightningjs/sdk";

const { Tools } = Lightning;

// size of entire component
const COMP_WIDTH = 780;
const COMP_HEIGHT = 100;

// size of scrubber
const SCRUB_WIDTH = COMP_WIDTH - 40;
const SCRUB_HEIGHT = 20;

export default class PlayerProgressBar extends Lightning.Component
{
	static _template()
	{
		return {
			BG: {
				rect: true,
				color: 0,
				x: 0,
				y: 0,
				w: COMP_WIDTH,
				h: COMP_HEIGHT,
				transition: {
					color: { duration: 0.5 },
				}
			},

			ScrubberBG: {
				x: 20,
				y: 40,
				w: SCRUB_WIDTH,
				h: SCRUB_HEIGHT,
				texture: Tools.getRoundRect(SCRUB_WIDTH, SCRUB_HEIGHT, 10, 0, 0, true, 0x7FFFFFFF),
			},

			ProgressArea: {
				clipping: true,
				x: 20,
				y: 40,
				w: 0,
				h: SCRUB_HEIGHT,
				ScrubberProgress: {
					w: SCRUB_WIDTH,
					h: SCRUB_HEIGHT,
					texture: Tools.getRoundRect(SCRUB_WIDTH, SCRUB_HEIGHT, 10, 0, 0, true, 0xFFFFFFFF),
				},
			},

			ScrubberHandle: {
				visible: false,
				x: 5,
				y: 35,
				w: 30,
				h: 30,
				texture: Tools.getRoundRect(30, 30, 15, 0, 0, true, 0xFF82de37),
			},
		}
	}

	static _states()
	{
		return [
			class IdleState extends this 
			{
				_handleEnter()
				{
					this._setState('ScrubbingState');
				}
			},

			class ScrubbingState extends this
			{
				_handleKey()
				{
					return true;
				}

				_handleEnter()
				{
					this._setState('IdleState');
					return true;
				}

				_handleLeft()
				{
					VideoPlayer.seek(VideoPlayer.currentTime - 30);
					return true;
				}

				_handleRight()
				{
					VideoPlayer.seek(VideoPlayer.currentTime + 30);
					return true;
				}

				$enter()
				{
					if (VideoPlayer.playing)
						VideoPlayer.pause();
					
					this.tag('ScrubberHandle').patch({ visible: true });
				}

				$exit()
				{
					VideoPlayer.play();

					this.tag('ScrubberHandle').patch({ visible: false });
				}
			}
		]
	}

	setProgress(value)
	{
		var size = SCRUB_WIDTH * value;
		var pos = size + 5;

		this.tag('ProgressArea').patch({ w: size });
		this.tag('ScrubberHandle').patch({ x: pos });
	}

	_init()
	{
		this._setState('IdleState');
	}

	_focus()
	{
		this.tag('BG').setSmooth('color', 0x40FFFFFF);
	}

	_unfocus()
	{
		this.tag('BG').setSmooth('color', 0);
	}
}