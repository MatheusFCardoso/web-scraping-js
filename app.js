import express from 'express';
import path from 'path';

import session from 'express-session';
import MongoStore from 'connect-mongo';
import flash from 'connect-flash';

import mongoose from 'mongoose';
import { middlewareGlobal } from './src/middlewares/middleware';

import homeRoutes from './routes/home';
import puppeteerRoutes from './routes/puppeteer';
import noticiaRoutes from './routes/noticia';

require('dotenv').config();

const sessionOptions = session({
  secret: 'sdasfsslkdslkdflkdflkdfdslfkfdldfdkl',
  store: MongoStore.create({ mongoUrl: process.env.CONNECTION_STRING }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
  },
});

class App {
  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
    this.set();
    this.connect();
  }

  connect() {
    mongoose.connect(
      process.env.CONNECTION_STRING,
      { useNewUrlParser: true, useUnifiedTopology: true },
    )
      .then(() => {
        console.log('\nconectado com a base de dados');
        this.app.emit('pronto');
      }).catch((err) => console.log(err));
  }

  middlewares() {
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.use(sessionOptions);
    this.app.use(flash());
    this.app.use(middlewareGlobal);
  }

  set() {
    this.app.set('views', path.resolve(__dirname, 'src', 'views'));
    this.app.set('view engine', 'ejs');
  }

  routes() {
    this.app.use('/', homeRoutes);
    this.app.use('/puppeteer', puppeteerRoutes);
    this.app.use('/noticias', noticiaRoutes);
  }
}

export default new App().app;
