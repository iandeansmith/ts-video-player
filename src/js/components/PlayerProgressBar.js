
import { Lightning, VideoPlayer } from "@lightningjs/sdk";
import { formatSecondsIntoTime } from '../utils/time';

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
				},
				
				ScrubberBG: {
					rect: true,
					color: 0x7FFFFFFF,
					x: 20,
					y: 40,
					w: SCRUB_WIDTH,
					h: SCRUB_HEIGHT,
					shader: {
						type: Lightning.shaders.RoundedRectangle,
						radius: 10,
					}
				},

				ProgressArea: {
					clipping: true,
					x: 20,
					y: 40,
					w: 0,
					h: SCRUB_HEIGHT,
					ScrubberProgress: {
						rect: true,
						color: 0xFFFFFFFF,
						w: SCRUB_WIDTH,
						h: SCRUB_HEIGHT,
						shader: {
							type: Lightning.shaders.RoundedRectangle,
							radius: 10,
						}
					},
				},

				ScrubberHandle: {
					rect: true,
					color: 0xFF82de37,
					visible: false,
					x: 5,
					y: 35,
					w: 30,
					h: 30,
					shader: {
						type: Lightning.shaders.RoundedRectangle,
						radius: 15,
					}
				},

				CurrentTime: {
					x: 20,
					y: 20,
					text: {
						text: '99:99:99',
						textColor: 0x7FFFFFFF,
						fontSize: 16,
					}
				},

				TotalTime: {
					x: COMP_WIDTH - 120,
					y: 20,
					w: 100,
					text: {
						text: '99:99:99',
						textAlign: 'right',
						textColor: 0x7FFFFFFF,
						fontSize: 16,
					}
				},
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
				// capture all key input to make sure the user doesn't leave before they're done scrubbing
				_handleKey()
				{
					return true;
				}

				// leave scrubbing state once they press enter
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

					this.fireAncestors('$lockPlayerOverlay', true);
				}

				$exit()
				{
					VideoPlayer.play();

					this.tag('ScrubberHandle').patch({ visible: false });

					this.fireAncestors('$lockPlayerOverlay', false);
				}
			}
		]
	}

	setProgress(current, duration)
	{
		var value = current / duration;
		var size = SCRUB_WIDTH * value;
		var pos = size + 5;
		var currentTime = formatSecondsIntoTime(current);
		var totalTime = formatSecondsIntoTime(duration);


		this.tag('ProgressArea').patch({ w: size });
		this.tag('ScrubberHandle').patch({ x: pos });
		this.tag('CurrentTime').patch({ 
			text: {
				text: currentTime,
			}
		});
		this.tag('TotalTime').patch({ 
			text: {
				text: totalTime,
			}
		});
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