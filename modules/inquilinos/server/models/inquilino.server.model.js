'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  validator = require('validator'),
  Schema = mongoose.Schema;


var validateLocalStrategyEmail = function (email) {
  return ((this.provider !== 'local' && !this.updated) || validator.isEmail(email, { require_tld: false }));
};
/**
 * Inquilino Schema
 */
var InquilinoSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  nome: {
    type: String,
    trim: true,
    required: 'Nome é obrigatório'
  },
  sobrenome: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    default: '',
    validate: [validateLocalStrategyEmail, 'Por vafor insira um e-mail válido']
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Inquilino', InquilinoSchema);
