'use strict';

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const toCal = 'cal/2016/1'
const fs = require('fs');

const upload = require('multer')({dest: 'tmp/uploads'});
const bodyParser= require('body-parser');

app.set('view engine', 'jade');
app.get('/', (req, res) => {
  res.render('index', {
    title: 'Super Cool App',
    date: new Date(),
    toCal: toCal
  });
});


app.locals.title = 'THE Super Cool App';

// Put your middleware functions before your routes

//app.use(bodyParser.urlencoded({extended:false}))

app.get('/contact', (req, res) => {
    res.render('contact');
});

app.post('/contact', (req, res) => {
  res.send(`<h1>Thanks contact ${name}</h1>`);
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


    //Wait for all characters to be sent
    //setTimeout(() => {
      //res.end();
     //}, 20000);
  //});
     //setTimeout(() => {
    //res.end('<h1>Goodbye</h1>');
  //}, 5000);
  //}else if (req.url === '/random') {
    //res.end(Math.random().toString());
  //} else {
      //res.writeHead(403);
      //res.end('Access Denied!');
  //}


app.get('/random', (req, res)=> {
  res.end(Math.random().toString());
});

app.get('/random/:min/:max', (req, res) => {
  const min = req.params.min
  const max = req.params.max
  res.status(200).send(Math.floor(Math.random()*(max-min+1)+min).toString());
});


//app.all('*', (req, res) => {
////Express version
  //res
    //.status(403)
    //.send('Access Denied!');
////Non-express
     ////res.writeHead(403);
      ////res.end('Access Denied!');
//});

app.listen(PORT, () => {
  console.log(`Node.js server is started. Listening on port ${PORT}`);
});


