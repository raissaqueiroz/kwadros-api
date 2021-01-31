const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

require('dotenv').config();

const UserSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
		},
		password_hash: {
			type: String,
			required: true,
		},
		status: {
			type: Boolean,
			required: true,
			default: true,
		},
		level_id: {
			type: Schema.Types.ObjectId,
			ref: 'Level',
			default: '5ff0dce64c11e85f00dfd771'
		}
	},
	{ timestamps: true }
);

UserSchema.pre('save', async function (next) {
	if (this.password_hash) {
		const hash = await bcrypt.hash(this.password_hash, 10);

		this.password_hash = hash;
	}

	next();
});

UserSchema.pre('findOneAndUpdate', async function (next) {
	if (this._update.password_hash) {
		const hash = await bcrypt.hash(this._update.password_hash, 10);

		this._update.password_hash = hash;
	}

	next();
});

module.exports = model('User', UserSchema);
