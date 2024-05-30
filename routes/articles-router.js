const articlesRouter = require('express').Router();

const articlesController = require('../controllers/articles.controller.js');

articlesRouter.get('/', articlesController.getArticles);

articlesRouter.route('/:article_id')
    .get(articlesController.getArticleById)
    .patch(articlesController.patchArticleById);

articlesRouter.route('/:article_id/comments')
    .get(articlesController.getCommentsByArticleId)
    .post(articlesController.postCommentByArticleId);

module.exports = articlesRouter;