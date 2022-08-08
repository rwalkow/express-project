const express = require('express');
const path = require('path');
const hbs = require('express-handlebars');
const multer = require('multer')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });

const app = express();

app.use(express.urlencoded({ extended: false }));

app.engine('hbs', hbs({ extname: 'hbs', defaultLayout: 'main' }));

app.set('view engine', 'hbs');

app.use((req, res, next) => {
  res.show = (name) => {
    res.sendFile(path.join(__dirname, `/views/${name}`));
  };
  next();
});

app.post('/contact/send-message', upload.single('project_design'), (req, res) => {
  const { author, sender, title, message } = req.body;
  const originalname = (req.file) ? req.file['originalname'] : '';

  if (author && sender && title && message && originalname) {
    res.render('contact', { file_name: originalname, layout: 'main', isSent: true });
  }
  else {
    res.render('contact', { layout: 'main-dark', isError: true });
  }
});

app.use('/user', (req, res, next) => {
   res.render('forbidden');
});

app.use(express.static(path.join(__dirname, '/public')));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/hello/:name', (req, res) => {
  res.render('hello', { name: req.params.name });
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/contact', (req, res) => {
  res.render('contact');
});

app.get('/info', (req, res) => {
  res.render('info');
});

app.get('/history', (req, res) => {
  res.render('history');
});

app.post('/contact/send-message', (req, res) => {
  const { author, sender, title, message } = req.body;
  if (author && sender && title && message) {
    res.send('The message has been sent!');
  } else {
    res.send("You can't leave this field empty! ");
  }
});

app.use((req, res) => {
  if (res.status(404)) res.render('404');
});

app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});
