# Weather-o-rama

Web app for displaying the weather of a selected location.

## Installation

### Front-end
For local deployment:

```bash
    cd app
    npm i #install dependencies
    npm run dev
```
Edit the `vars.config.js` file to include the URL of the backend server API.

### Back-end
```bash
    cd server
    npm i #install dependencies
    node server.js
```
> [!IMPORTANT]
> Make sure to install and run Redis (default port, 6379), otherwise each call will be made to the Weather API directly.

## Documentation

The repository consists of two parts - `app` folder for the front-end, `server` folder for the back-end.<br />
Front-end uses React and MUI. <br />
Back-end uses Node.js with an optional Redis cache.

## Live Demo

A live deployed demo of the web app is available [here](https://master.d271k9fcuj72ht.amplifyapp.com/).

## Credits

[Meteo.lt API](https://api.meteo.lt/)<br />
[MUI](https://mui.com)<br />
[Redis](https://github.com/redis/node-redis)
