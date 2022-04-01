
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
        var diff = thisIndex - wrapperIndex;
        var factor = 1.0 / (Math.abs(diff) + 1);
        var angle = 0, scale;

        scale = clamp(factor, 0.85, 1.0);
        angle = (45 - (45 * factor)) * (Math.PI / 180);

        if (thisIndex < wrapperIndex)
            angle *= -1;
            
        // this.tag('Item').transition('scale').stop();
        this.tag('Item').setSmooth('scale', scale, { duration: 1 });
        this.tag('Item').setSmooth('shader.rx', angle, { duration: 1 });
    }
}