'use strict';

const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

  app.get('/hello', (req, res)=>{
    const name = req.query.name;
    const msg = `<h1>Hello ${name}!</h1>
 <h2>Goodbye ${name}</h2>`;

    res.writeHead(200, {
       'Content-Type': 'text/html'
    });

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
    console.log(req.params);
    res.end(monthYear(year, month, 'darwin'));
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


app.all('*', (req, res) => {
//Express version
  res
    .status(403)
    .send('Access Denied!');
//Non-express
     //res.writeHead(403);
      //res.end('Access Denied!');
});

app.listen(PORT, () => {
  console.log(`Node.js server is started. Listening on port ${PORT}`);
});


