// controllers/newsController.js (example)
const { Op } = require('sequelize');
const Article = require('../models/Article');

exports.getArticle = async (req, res, next) => {
    try {
        const slug = req.params.slug;

        const article = await Article.findOne({ where: { slug } });
        if (!article) {
            return res.status(404).render('404', { title: 'Article not found' });
        }

        const relatedArticles = await Article.findAll({
            where: {
                category: article.category,
                id: { [Op.ne]: article.id },
            },
            order: [['publishedAt', 'DESC']],
            limit: 3,
        });

        res.render('article', {
            title: article.title,
            article,
            relatedArticles,
        });
    } catch (err) {
        next(err);
    }
};
