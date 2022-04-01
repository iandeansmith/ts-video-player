
import { Lightning, Registry } from "@lightningjs/sdk";

const NUM_DOTS = 8;
const DOT_SIZE = 8;
const INTERVAL = 0.25;

export default class LoadingSpinner extends Lightning.Component
{
    static _template()
    {
        var tree = {};

        for(var i=0; i<=NUM_DOTS; i++)
        {
            tree[`Circle${i}`] = {
                rect: true,
                color: 0x7FFFFFFF,
                shader: {
                    type: Lightning.shaders.RoundedRectangle,
                    radius: DOT_SIZE / 2,
                },
                transitions: {
                    color: { duration: INTERVAL*2 },
                    scale: { duration: INTERVAL*2 },
                }
            };
        }

        return tree;
    }

    _cylceDots()
    {
        // reset previous dot
        if (this.dotIndex >= 0)
        {
            this.tag(`Circle${this.dotIndex}`).patch({
                smooth: {
                    color: 0x7FFFFFFF,
                    scale: 1,
                }
            });
        }

        // move to next dot
        this.dotIndex++;
        if (this.dotIndex >= NUM_DOTS)
            this.dotIndex = 0;

        // perform animation
        this.tag(`Circle${this.dotIndex}`).patch({
            smooth: {
                color: 0xFFFFFFFF,
                scale: 1.5,
            }
        });
    }

    _setup()
    {
        // current angle and amount to increment angle by
        var step = (Math.PI * 2) / NUM_DOTS;

        // size of ring
        var radius = this.size - DOT_SIZE;

        for(var i=0; i<8; i++)
        {
            let angle = step * i;
            let tag = this.tag(`Circle${i}`)

            let fields = {
                x: (this.size - (DOT_SIZE / 2)) + Math.cos(angle) * ((radius)/2),
                y: (this.size - (DOT_SIZE / 2)) + Math.sin(angle) * ((radius)/2),
                w: DOT_SIZE,
                h: DOT_SIZE,
            };

            tag.patch(fields);
        }

        // current dot being animated
        this.dotIndex = -1;
    }

    _enable()
    {
        // cycle through each dot to create the loading effect
        this.dotCycle = Registry.setInterval(() => this._cylceDots(), INTERVAL * 1000);
    }

    _disable()
    {
        // clear cycle interval
        Registry.clearInterval(this.dotCycle);
    }

}