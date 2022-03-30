
import { Launch } from '@lightningjs/sdk';
import MainApp from './components/MainApp';

declare global {
    interface Window 
    {
        initApp: Function;
    }
}

const config = {
    "appSettings": {
      "stage": {
        "clearColor": "0x00000000",
        "useImageWorker": true,
        "w": 1280,
        "h": 720
      },
      "debug": false
    },
    "platformSettings": {
      "path": "./",
      "log": true,
      "showVersion": true
    }
  };


window.initApp = function()
{
    const app:any = Launch(MainApp, config.appSettings, config.platformSettings, {});

    document.body.appendChild(app.stage.getCanvas());
}
