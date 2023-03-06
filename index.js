require('dotenv').config();
const express = require('express');
const http = require('http');
const app = express();
let path = require('path');
let fs = require('fs');
const socketio = require('socket.io');
const server = http.createServer(app);
const io = socketio(server);
var createError = require('http-errors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let handlebars = require('express-handlebars');
let session = require('express-session');
let fileUpload = require('express-fileupload');
let favicon = require("serve-favicon");
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: process.env.API
});

// view engine setup
app.set('views', path.join(__dirname, 'views/pages'));
app.use(favicon(path.join(__dirname, 'assets', '/images/logo/favicon.png')));
app.engine('hbs', handlebars.engine({ extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layouts/', partialsDir: __dirname + '/views/partials/' }));
app.use(session({ secret: "@tric!dot@dot@#]$" }));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'assets')));
app.use(fileUpload());

app.get('/', (req, res) => {
    res.render('chat', { title: "Chat", from: 'Sajad', style: 'chat', script: 'script' })
})

// Listen for incoming socket connections
io.on('connection', (socket) => {
    console.log('A user connected.');

    // Initialize empty context object
    let context = {};

    socket.on('message', async (data) => {
        const openai = new OpenAIApi(configuration);

        // Add previous conversation context to the prompt if available
        let prompt = data.content;
        if (context[data.from]) {
            prompt = context[data.from] + '\n' + prompt;
        }

        const completion = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: prompt,
            n: 1,
            max_tokens: 2049,
            stop: null,
            temperature: 0.7
        });

        if (completion.status == 200) {
            if (completion.data.choices[0].text.length > 0) {
                // Store the current conversation context
                context[data.from] = prompt + '\n' + completion.data.choices[0].text;
                socket.emit(data.from, { content: completion.data.choices[0].text })
            } else {
                socket.emit(data.from, { content: "I don't have a specific answer please contact my team 'Dot inc'." })
            }
        } else {
            socket.emit(data.from, { content: "I don't have a specific answer please contact my team 'Dot inc'." })
        }
    })


    // Handle disconnections
    socket.on('disconnect', () => {
        console.log('A user disconnected.');
    });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error', { title: err.status || 500, description: err.message || 'Internal server error.', status: err.status || 500, message: err.message || 'Internal Server Error', user: req.session.user });
});

server.listen('3008', () => {
    console.log('Server started :3008');
});
