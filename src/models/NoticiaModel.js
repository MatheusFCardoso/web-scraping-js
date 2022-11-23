import mongoose from "mongoose";

const NoticiaSchema = new mongoose.Schema({
  noticia: { type: String, required: true },
  urlNoticia: { type: String, required: true },
  dateNoticia: { type: Date, require: true },
});

const NoticiaModel = mongoose.model('Noticia', NoticiaSchema);

class Noticia {
  constructor() {
    this.noticia = null;
  }

  async create(noticia, urlNoticia, dateNoticia) {
    this.body = {
      noticia,
      urlNoticia,
      dateNoticia: `${dateNoticia}T14:00:00.000+00:00`,
    };
    this.noticia = await NoticiaModel.create(this.body);
  }

  async findAllNoticias() {
    const noticias = await NoticiaModel.find().sort({ dateNoticia: 1 });
    return noticias;
  }

  async findNoticias(search, date) {
    if (date === '') {
      const noticias = await NoticiaModel.find({
        noticia: { $regex: `.*${search}.*` },
      }).sort({ dateNoticia: 1 });
      return noticias;
    }
    const noticias = await NoticiaModel.find({
      noticia: { $regex: `.*${search}.*` },
      dateNoticia: `${date}T14:00:00.000+00:00`,
    });
    return noticias;
  }
}

export default Noticia;
