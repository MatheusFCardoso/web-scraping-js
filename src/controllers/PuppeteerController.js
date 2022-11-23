import puppeteer from 'puppeteer';
import Noticia from '../models/NoticiaModel';

class PuppeteerController {
  async index(req, res) {
    (async () => {
      const noticia = new Noticia();
      const noticiaValidate = await noticia.findNoticias('', req.body.date);
      if (noticiaValidate.length !== 0) {
        return res.redirect(`/noticias/?search=&date=${req.body.date}`);
      }
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(`https://valor.globo.com/impresso/${req.body.date.replace(/[-]/g, '')}`);

      const error404 = await page.evaluate(() => {
        const el = document.querySelector('.paginas-erro');
        if (!el) return null;
        return el;
      });

      if (error404 != null) {
        req.flash('errors', `Não há noticias no dia ${req.body.date}`);
        return res.redirect('/');
      }
      const noticias = await page.$$eval(`.newsfeed-post__body > .newsfeed-post__title > a`, (el) => el.map((link) => link.text));

      const urlNoticias = await page.$$eval(`.newsfeed-post__body > .newsfeed-post__title > a`, (el) => el.map((link) => link.href));

      const noticiasFiltradas = noticias.filter((key) => !(key === 'Curta' || key === 'Curtas'));
      const urlNoticiasFiltradas = urlNoticias.filter((key) => key.indexOf('curta') === -1);

      await browser.close();

      for (let key = 0; key < noticiasFiltradas.length; key += 1) {
        await noticia.create(noticiasFiltradas[key], urlNoticiasFiltradas[key], req.body.date);
      }
      return res.redirect(`/noticias/?search=&date=${req.body.date}`);
    })();
  }
}

export default new PuppeteerController();
