const monk = require('monk');
const NewsService = require('../services/NewsService.js');
const { logger } = require('../logger');
const env = require('../env.js');

let db = monk(env.dbPath);
let newsService = new NewsService(db);

module.exports.init = function (server) {
    server.get('/api/news', function (req, res) {
        newsService
            .getRecentNewsItems({ limit: req.query.limit })
            .then((news) => {
                res.send({ success: true, news: news });
            })
            .catch((err) => {
                logger.error(err);

                res.send({ success: false, message: 'Error loading news' });
            });
    });

    server.put('/api/news', function (req, res) {
        if (!req.user) {
            return res.status(401).send({ message: 'Unauthorized' });
        }

        if (!req.user.permissions || !req.user.permissions.canEditNews) {
            return res.status(403).send({ message: 'Forbidden' });
        }

        newsService
            .addNews({ poster: req.user.username, text: req.body.text, datePublished: new Date() })
            .then(() => {
                res.send({ success: true });
            })
            .catch((err) => {
                logger.error(err);

                res.send({ success: false, message: 'Error saving news item' });
            });
    });
};
