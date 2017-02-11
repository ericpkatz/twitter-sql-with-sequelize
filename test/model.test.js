const expect = require('chai').expect;
const db = require('../db');
const models = db.models;
const Tweet = models.Tweet;

describe('tweeting', ()=> {
  beforeEach((done)=> {
    db.sync()
      .then( ()=> done())
      .catch( err => done(err));
  });
  describe('after seeding', ()=> {
    let tweets;
    beforeEach( done => {
      db.seed()
        .then( ()=> Tweet.findAll())
        .then( _tweets => tweets = _tweets)
        .then( ()=> done())
        .catch( err=> done(err));
    });
    it('has four tweets', ()=> {
      expect(tweets.length).to.equal(3);
    });
  });
});
