var express = require('express');
var router = express.Router();
var Book = require('../models/book');

/**
 * GET /movies
 *
 * return all movies from database
 */
router.get('/', function (req, res) {
  Book.find({}, function (err, books) {  // look for everything, you put an empty {}
    if (err) {
      res.sendStatus(500);
      return;
    }

    res.send(books);
  });
});

/**
 * POST /movies
 *
 * add a new movie to the database
 */
router.post('/', function (req, res) {
  console.log('POST req.body: ', req.body);
  var book = Book(req.body);
  book.save(function (err) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    res.sendStatus(201);  // CREATED
  });
});

/**
 * PUT /movies/<id>
 *
 * update a movie with the given id
 */
router.put('/:id', function (req, res) {
  var book = req.body;
  var id = req.params.id;
  Book.findByIdAndUpdate(id, book, function (err, book) {  // first book matches var book line 46
    if (err) {                                            // second book in the function is coming back from Mongo in an object
      res.sendStatus(500);
      return;
    }

    res.status(204).send(book);
  });
});

/**
 * DELETE /movies/<id>
 *
 * delete a movie with the given id
 */
router.delete('/:id', function (req, res) {
  var id = req.params.id;
  Book.findByIdAndRemove(id, function (err) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    res.sendStatus(204);
  });
});

/** -- COMENTS ROUTE -- **/
router.post('/:id/comments', function (req, res) {
  var id = req.params.id;
  var comment = req.body;

  console.log('New comment data', comment);

  Book.findById(id, function (err, book) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    book.comments.push(comment);
    book.save(function (err) {
      if (err) {
        console.log('Error: ', err);
        res.sendStatus(500);
        return;
      }

      res.sendStatus(204);
    });
  });
});

module.exports = router;
