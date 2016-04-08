'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Inquilino = mongoose.model('Inquilino'),
  User = mongoose.model('User'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an inquilino
 */
exports.create = function (req, res) {
  var inquilino = new Inquilino(req.body);
  inquilino.user = req.user;
  inquilino.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(inquilino);
      criarUsuario(inquilino);
    }
  });
};

// cria um novo usuario ao cadastrar inquilino
function criarUsuario(inquilino) {

  Inquilino.find({}, function(err, items) {
    var numero = items.length;
    numero = (String(numero).length < 2) ? String('0' + numero) : String(numero);

    var user = new User();

    user.firstName = inquilino.nome;
    user.lastName = inquilino.sobrenome;
    user.email = inquilino.email;
    user.provider = 'local';
    user.displayName = user.firstName + ' ' + user.lastName;
    user.roles = 'admin';
    user.username = inquilino.nome.replace(/\s/g, '') + numero; // retirar esacos em branco do nome
    user.password = 'Xi94fdf0*19';
    user.inquilino = inquilino._id;
    user.save(function(err, user) {
      if (err) return console.error(err);
      console.dir('Novo usuário salvo com sucesso!');
    });
  });

}

/**
 * Show the current inquilino
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var inquilino = req.inquilino ? req.inquilino.toJSON() : {};

  // Add a custom field to the Inquilino, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Inquilino model.
  inquilino.isCurrentUserOwner = !!(req.user && inquilino.user && inquilino.user._id.toString() === req.user._id.toString());

  res.json(inquilino);
};

/**
 * Update an inquilino
 */
exports.update = function (req, res) {
  var inquilino = req.inquilino;

  inquilino.title = req.body.title;
  inquilino.content = req.body.content;

  inquilino.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(inquilino);
    }
  });
};

/**
 * Delete an inquilino
 */
exports.delete = function (req, res) {
  var inquilino = req.inquilino;

  inquilino.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(inquilino);
    }
  });
};

/**
 * List of Inquilinos
 */
exports.list = function (req, res) {
  Inquilino.find().sort('-created').populate('user', 'displayName').exec(function (err, inquilinos) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(inquilinos);
    }
  });
};

/**
 * Inquilino middleware
 */
exports.inquilinoByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Inquilino is invalid'
    });
  }

  Inquilino.findById(id).populate('user', 'displayName').exec(function (err, inquilino) {
    if (err) {
      return next(err);
    } else if (!inquilino) {
      return res.status(404).send({
        message: 'No inquilino with that identifier has been found'
      });
    }
    req.inquilino = inquilino;
    next();
  });
};
