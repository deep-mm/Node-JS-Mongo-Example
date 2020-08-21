const express = require('express');
const bodyParser = require('body-parser');
var path = require('path');
const app = express();
const port = 3000;

const mongoose = require("mongoose");
//   fix url 
//const url = process.env.MONGOLAB_URI;
const url = ('mongodb+srv://admin:admin@cluster0.1iyiy.azure.mongodb.net/articlesdb?retryWrites=true&w=majority');


mongoose.Promise = global.Promise;
mongoose.connect(url);

const articleSchema = new mongoose.Schema({
  title: String,
  articleText: String,
  fullName: String
});

const Article = mongoose.model("Article", articleSchema);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static('public'));

app.get('/', function (request, response) {
  response.render('index')
 });

 
app.listen(process.env.PORT||3000, function () { 
 console.log('Example app listening on port 3000!')
});

// app.listen(app.get('port'), function () {
//  console.log('Node app is running on port', app.get('port'));
// });

app.get('/articles', function (req, response) {
  Article.find({}, { _id: 0, title: 1, articleText: 1, fullName: 1 }).limit(5).exec(function (err, articles) {
    if (err) return console.error(err);
    response.render('articles', { articles: articles });
  });
});

app.post("/addArticle", (req, res) => {
const myData = new Article(req.body);
  myData.save()
    .then(item => {
      res.send(`<h2>item with title:<span><i>"${req.body.title}"</i></span> saved to database</h2>
      <a style="font-size:25px" href="/..">Home page</a>`);
    })
    .catch(err => {
      res.status(400).send("unable to save to database");
    });
});

module.exports = app;
