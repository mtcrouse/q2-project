'use strict';

const Joi = require('joi');

module.exports.post = {
	body: {
		searchId: Joi.number()
			.label('searchId')
			.integer()
			.min(1)
			.required()
	}
}

module.exports.ucheck = {
	query: {
		userId: Joi.number()
			.label('userId')
			.integer()
			.min(1)
			.required()
	}
}

module.exports.fcheck = {
	query: {
		favoriteId: Joi.number()
			.label('favoriteId')
			.integer()
			.min(1)
			.required()
	}
}

module.exports.patch = {
	params: {
		favoriteId: Joi.number()
			.label('favoriteId')
			.integer()
			.min(1)
			.required()
	},
	body: {
		searchId: Joi.number()
			.label('userId')
			.integer()
			.min(1),
		count: Joi.number()
			.integer()
	}
}

module.exports.delete = {
	params: {
		id: Joi.number()
			.integer()
			.required()
			.min(1)
			.label('id')
	}
}