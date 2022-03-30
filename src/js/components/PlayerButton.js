
import { Lightning, Utils, Img, VideoPlayer } from "@lightningjs/sdk";

export const PB_ICON_PLAY = "play";
export const PB_ICON_PAUSE = "pause";
export const PB_ICON_STOP = "stop";
export const PB_ICON_CLOSE = "close";

export default class PlayerButton extends Lightning.Component
{
	static _template()
	{
		return {
			BG: {
				color: 0x00FFFFFF,
				rect: true,
				x: 0,
				y: 0,
				w: w => w,
				h: h => h,
				transitions: {
					color: { duration: 0.5 },
				}
			},

			Icon: {
				x: 0,
				y: 0,
				w: w => w,
				h: h => h,
			}
		}
	}

	_setup()
	{
		if (this.iconType != null)
			this.setIconType(this.iconType);
	}

	_stopAnimation()
	{
		if (this.pressedAnim != null)
			this.pressedAnim.finish();
	}

	_stopTransition()
	{
		this.tag('BG').transition('color').finish();
	}

	_focus()
	{
		this.tag('BG').patch({
			smooth: {
				color: 0x7FFFFFFF,
			}
		});
	}

	_unfocus()
	{
		this.tag('BG').patch({
			smooth: {
				color: 0x00FFFFFF,
			}
		});
	}

	_handleEnter()
	{
		// add effect when clicked
		this.pressedAnim = this.tag('BG').animation({
			duration: 0.5,
			repeat: 0,
			stopMethod: 'immediate',
			actions: [
				{
					p: 'color',
					v: {
						0: 0xFFFFFFFF,
						1: 0x7FFFFFFF
					}
				}
			]
		});
		this.pressedAnim.start();

		// send signal
		this.signal('pressed');
	}

	setIconType(type)
	{
		var icons = {
			[PB_ICON_PLAY]: Utils.asset("images/play-solid.png"),
			[PB_ICON_PAUSE]: Utils.asset("images/pause-solid.png"),
			[PB_ICON_STOP]: Utils.asset("images/stop-solid.png"),
			[PB_ICON_CLOSE]: Utils.asset("images/xmark-solid.png"),
		};

		if (icons.hasOwnProperty(type))
		{
			this.tag('Icon').patch({
				texture: Img(icons[type]).contain(100, 100),
			});
		}
	}
}