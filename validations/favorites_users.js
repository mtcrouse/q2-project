'use strict';

const Joi = require('joi');

module.exports.post = {
	body: {
		favoriteId: Joi.number()
			.label('favoriteId')
			.integer()
			.min(1)
			.required()
	}
}