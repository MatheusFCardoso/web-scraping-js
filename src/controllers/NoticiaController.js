import moment from 'moment';
import Noticia from '../models/NoticiaModel';

class NoticiaController {
  async index(req, res) {
    const noticia = new Noticia();
    const { search, date } = req.query;
    if (search === undefined && date === undefined) {
      const noticias = await noticia.findAllNoticias();
      res.render('noticias', { noticias, moment });
    } else {
      const noticias = await noticia.findNoticias(search, date);
      res.render('noticias', {
        noticias, moment, search, date,
      });
    }
  }
}

export default new NoticiaController();
