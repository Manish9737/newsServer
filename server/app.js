var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/', indexRouter);
app.use('/users', usersRouter);

const API_KEY = "3a001d4fcd044b3a8adeecdc6a89cb89";
const url = "https://newsapi.org/v2/everything";

app.get('/news', async (req, res) => {
  const query = req.query.q;
  if (!query) {
      return res.status(400).json({ error: "Query parameter 'q' is required" });
  }

  try {
      const response = await fetch(`${url}?q=${query}&apiKey=${API_KEY}`);
      const data = await response.json();
      res.json(data);
  } catch (error) {
      console.error('Error fetching news:', error);
      res.status(500).json({ error: "Internal server error" });
  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
