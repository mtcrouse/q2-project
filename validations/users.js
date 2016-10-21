'use strict';

const Joi = require('joi');

module.exports.post = {
  body: {
    email: Joi.string()
    	.label('email')
    	.required()
    	.email(),
    password: Joi.string()
    	.label('password')
    	.min(8),
  	username: Joi.string()
  		.label('username')
  		.min(6)
  }
};