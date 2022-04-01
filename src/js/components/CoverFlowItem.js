
import { Lightning } from '@lightningjs/sdk';

import { store } from '../store';
import { clamp } from '../utils/math';

export default class CoverFlowItem extends Lightning.Component
{
    static _template()
    {
        return {
            Item: {
                x: 0,
                y: 0,
                w: w => w,
                h: h => h,
                rtt: true,

                shader: {
                    type: Lightning.shaders.Perspective,
                    rx: 0 * (Math.PI / 180),  
                },

                Cover: {
                    w: w => w,
                    h: h => h,
                    Image: {
                        w: w => w,
                        h: h => h,
                        shader: {
                            type: Lightning.shaders.RoundedRectangle,
                            radius: 20,
                        }
                    },
                }
            },
        }
    }

    _setup()
    {
        this.tag('Image').patch({
            src: this.movie.poster,
        });
    }

    updatePosition(thisIndex, wrapperIndex, numItems)
    {
        // get the difference between the current index and the index of this item
        var diff = thisIndex - wrapperIndex;

        // normalize it into 0..1
        var factor = 1.0 / (Math.abs(diff) + 1);

        // angle and scale are based off of this factor
        var angle = 0, scale;

        // just use the absolute factor for the scale, clamped between 0.85 and 1.0
        scale = clamp(factor, 0.85, 1.0);

        // rotate the item up to 45 degrees depending on how far it is away from the current index
        angle = (45 - (45 * factor)) * (Math.PI / 180);

        // change rotation angle if the item is on the left side of the focused item
        if (thisIndex < wrapperIndex)
            angle *= -1;
                    
        this.tag('Item').setSmooth('scale', scale, { duration: 1 });
        this.tag('Item').setSmooth('shader.rx', angle, { duration: 1 });
    }
}