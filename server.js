const express = require('express');
const swig = require('swig');
swig.setDefaults({ cache: false });
const db = require('./db');
const models = db.models;
const User = db.models.User;
const Tweet = db.models.Tweet;

const app = express();
app.use(require('body-parser').urlencoded({ extended: false }));

app.set('view engine', 'html');
app.engine('html', swig.renderFile);

app.get('/tag', (req, res, next)=> {
  Tweet.findAll({
    where: { tags: { $contains: [req.query.tag] }},
    include: [ User ]
  })
  .then( tweets => {
    res.render('index', { tweets: tweets, tag: req.query.tag });
  })
  .catch( err => next(err));
});

app.get('/:name?', (req, res, next)=> {
  Tweet.getTweets(req.params.name)
    .then( tweets => {
      res.render('index', { tweets, name: req.params.name });
    })
    .catch( error => next(error));
});

app.post('/', (req, res, next)=> {
  Tweet.createTweet(req.body.name, req.body.content, req.body.tags)
    .then( tweet => res.redirect(`/${req.body.name}`))
    .catch( error => next(error));
});

const port = process.env.PORT || 3000;

db.sync()
  .then(()=> db.seed())
  .then(()=> console.log('synced and seeded'))
  .catch( err=> console.log(err));


app.listen(port, ()=> console.log(`listening on port ${port}`));
