
import { Lightning, Router } from "@lightningjs/sdk";

import MovieBrowser from "./MovieBrowser";
import MoviePlayer from "./MoviePlayer";


const routes = {
    root: 'home',
    routes: [
        {
            path: 'home',
            component: MovieBrowser,
        },
        {
            path: 'player/:id',
            component: MoviePlayer,
        }
    ]
}

export default class MainApp extends Router.App
{
    _setup()
    {
        Router.startRouter(routes);
    }
}