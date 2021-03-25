const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');
const origin = process.env.origin || "http://localhost:4200";
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: true })
const verifyToken = require('./middleware/verifyToken.js');
const fs = require('fs');
const path = require('path');
const mode = process.env.Mode;
const s3 = require('./Config/s3Bucket.js');
console.log('email: ' + process.env.email);
console.log('emailPassword: ' + process.env.email_Password);
console.log('origin: ' + process.env.origin);
app.use('/images', express.static(path.join(__dirname,'../public/images')));
console.log(process.env.email);
if(mode == "production"){
  app.use(express.static(path.join(__dirname, '../../dist/filmApp')));
}
app.use(cors({
  credentials: true,
  origin: origin,
}));
app.use(bodyParser.json());
app.use(urlencodedParser);
app.listen(port,()=>{
  console.log('Server aperto sulla porta: ' + port);
});
app.get('/',(req,res)=>{
  res.status(200);
  return res.end('');
});
app.use('/api/user',require('./Routes/userRoutes'));
app.use('/api/auth',verifyToken(),require('./Routes/authRoutes.js'));
app.use('/api/film',require('./Routes/filmRoutes.js'));
app.use('/api/list',verifyToken(),require('./Routes/listRoutes.js'));
app.use('/api/genre',require('./Routes/genreRoutes.js'));
app.use('/api/review',require('./Routes/reviewRoutes.js'));
app.get('/',(req,res)=>{
  res.end('');
});
app.get('*', (req,res)=>{
  if(mode == 'production'){
    res.sendFile(path.join(__dirname, '../../dist/filmApp/index.html'));
  }
  else{
    res.status(404).send('404');
    res.end('');
  }
});
