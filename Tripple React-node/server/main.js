import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import session from 'express-session';


const app = express();
const port = 80;
const devPort = 8080;

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({limit: '10mb', extended: false, parameterLimit: 100000}));

app.use(session({
    secret: 'CodeLab1$1$234',
    resave: false,
    saveUninitialized: true
}));



if(process.env.NODE_ENV == 'development') {
    console.log('Server is running on development mode');
    const config = require('../webpack.dev.config');
    const compiler = webpack(config);
    const devServer = new WebpackDevServer(compiler, config.devServer);
    devServer.listen(
        devPort, () => {
            console.log('webpack-dev-server is listening on port', devPort);
        }
    );
}

app.use('/images',express.static(path.join(__dirname,'./uploads')));
app.use('/', express.static(path.join(__dirname, './../public')));

app.listen(port, () => {
    console.log('Express is listening on port', port);


});

import api from './routes';
app.use('/api',api);


app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, './../public/index.html'));
});
