const Sequelize = require('sequelize');

const db = new Sequelize(process.env.DATABASE_URL);

const User = db.define('user', {
  name: Sequelize.STRING,
});

const Tweet = db.define('tweet',
    {
      content: Sequelize.STRING,
      tags: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        set: function(val){
          var tags = val.split(',').map( tag => tag.trim());
          this.setDataValue('tags', tags);
        }
      }
    },
    {
      classMethods: {
        getTweets: (name)=> {
          let filter = {};
          if(name){
            filter.name = name;
          }
          return Tweet.findAll({
            include: [  {
              model: User,
              where: filter 
            }]
          });
        },
        createTweet: (name, content, tags)=> {
          return User.findOne({ where: { name: name}})
            .then((user)=> {
              if(user) return user;
              return User.create({ name: name });
            })
            .then( user => Tweet.create({ content: content, userId: user.id, tags: tags }));
        } 
      }
    }
);

Tweet.belongsTo(User);
User.hasMany(Tweet);

let _conn;
const connect = ()=> {
  if(_conn) return _conn;
  _conn = db.authenticate();
  return _conn;
};

const seed = ()=> {
  return connect()
    .then( ()=> {
      return User.create({ name: 'prof'})
    })
    .then( user => Tweet.createTweet('prof', 'hi foo', 'foo' )) 
    .then( user => Tweet.createTweet('prof', 'hi foo bar', 'foo,bar' )) 
    .then( user => Tweet.createTweet('mitch', 'hi buzz', 'buzz' )) 
};
const sync = ()=> {
  return connect()
    .then(()=> {
      return db.sync({ force: true });
    });
};
module.exports = {
  sync,
  seed,
  models: {
    Tweet,
    User
  }
};
