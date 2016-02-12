'use strict';

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const MongoClient = require('mongodb').MongoClient
const MONGO_URL = 'mongodb://localhost:27017/node-webserver';

const toCal = 'cal/2016/1'
const fs = require('fs');
const imgur = require('imgur');
const path = require('path');
const request = require('request');
const upload = require('multer')({dest: 'tmp/uploads'});
const bodyParser= require('body-parser');
const _ = require('lodash');
const cheerio = require('cheerio');

let db;

app.set('view engine', 'jade');

// Put Sass in. Static goes AFTER require.
app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));

app.use(express.static(path.join(__dirname, 'public')));
//////////////////////////////////////////
app.get('/', (req, res) => {
  res.render('index', {
    title: 'Super Cool App',
    date: new Date(),
    toCal: toCal
  });
});

MongoClient.connect(MONGO_URL, (err, database) => {
  if (err) throw err;
  db = database;

  app.listen(PORT, () => {
    console.log(`Node JS started on port ${PORT}`);
  });
});

app.locals.title = 'THE Super Cool App';

// Put your middleware functions before your routes

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}))

app.get('/api', (req, res) => {
  res.send({'hello' : 'world'});
});

app.post('/api', (req, res) => {
  //console.log
  const obj = _.mapValues(req.body, val => val.toUpperCase());
  db.collection('allcaps').insertOne(obj, (err, result) => {
    if (err) throw err;

    console.log(result.ops[0]);
    res.send(obj);
  })
});

app.get('/api/news', (req, res) => {
  db.collection('news').findOne({}, (err, doc) => {
    if (doc) {
      console.log(doc._id.getTimestamp())
    } else {
      const url = 'http://cnn.com';

      request.get(url, (err, response, html) => {
        if (err) throw err;

        const news = [];
        const $ = cheerio.load(html);

        const $bannerText = $('.banner-text');

        news.push({
          title: $bannerText.text(),
          url: url + $bannerText.closest('a').attr('href')
        });

        const $cdHeadline = $('.cd__headline');

        _.range(1, 12).forEach(i => {
          const $headline = $cdHeadline.eq(i);

          news.push({
            title: $headline.text(),
            url: url + $headline.find('a').attr('href')
          });
        });

        db.collection('news').insertOne({ top: news }, (err, result) => {
          if (err) throw err;

          res.send(news);
        });
      });
    }
  })


});

app.get('/api/weather', (req, res) => {
  const url = 'https://api.forecast.io/forecast/b4ad2be4cd354044386a3efea6b15c18/37.8267,-122.423'
  request.get(url, (err, response, body) => {
    if (err) throw err;

    res.header('Access-Control-Allow-Origin', '*');
    res.send(JSON.parse(body));
  });
});





app.get('/contact', (req, res) => {
  res.render('contact');
});

app.post('/contact', (req, res) => {
  const obj = {
    name: req.body.name,
    email: req.body.email,
    message: req.body.message
  };

  db.collection('contact').insertOne(obj, (err, result) => {
    if (err) throw err;

    res.send(`<h1>Thanks for contacting us ${obj.name}</h1>`);
  });
});







app.get('/send-photo', (req, res) => {
  res.render('sendphoto');

});

app.post('/send-photo', upload.single('image'), (req, res) => {
  let tmp_path = req.file.path
  let target_path = './public/images/' + req.file.originalname;
    fs.rename(tmp_path, target_path, function(err) {
        if (err) throw err;
        // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
        fs.unlink(tmp_path, function() {
            if (err) throw err;
            res.end('File uploaded to: ' + target_path + ' - ' + req.file.size + ' bytes');
        });

        function upload() {
        imgur.uploadFile(target_path)
          .then(function (json) {
              console.log(json.data.link);
          })
          .catch(function (err) {
              console.error("err on upload", err.message);
          });
       }
       upload()
    });

  res.send('<h1>Thanks photo</h1>');
});





app.get('/hello', (req, res)=>{
    const name = req.query.name;
    const msg = `<h1>Hello ${name}!</h1>
 <h2>Goodbye ${name}</h2>`;

    res.writeHead(200, {
       'Content-Type': 'text/html'
    });
i
    //const msg = `<h1>BORK BORK BORK!</h1>`;
    let time = 1000;
    //chunk response by character
    msg.split('').forEach((char, i) => {
     setTimeout(() => {
       res.write(char);
      }, 100*i);
    });
 });

app.get('/cal/:year/:month', (req, res) => {
    const monthYear = require('node-cal/lib/month').joinOutput;
    const month = parseInt(req.params.month);
    const year = parseInt(req.params.year);
    res.render('cal', {
      title: "This is the Calendar Title",
      cal: monthYear(year, month, 'darwin')
    })

    //res.end(monthYear(year, month, 'darwin'));
 });



app.get('/', (req, res)=>{
  db.collection('news').findOne({}, {sort: {_id:-1}, (err, doc) =>{
    if (err) throw err;

    const topTitle = doc.top[0].title;
    const topUrl = doc.top[0].url;

    res.render('index'{
      topTitle: topTitle,
      topUrl: topUrl
      });
    }
  })
})

app.get('/random', (req, res)=> {
  res.end(Math.random().toString());
});

app.get('/random/:min/:max', (req, res) => {
  const min = req.params.min
  const max = req.params.max
  res.status(200).send(Math.floor(Math.random()*(max-min+1)+min).toString());
});


