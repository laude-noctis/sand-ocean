const { Schema, Types } = require('mongoose');

const userSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
            trimmed: true
        },
        email: {
            type: String,
            required: true,
            unique: true,

        },
        thoughts: {
            type: mongoose.Schema.Types.ObjectId, ref: 'Thought'
        },
        friends: {
            type: mongoose.Schema.Types.ObjectId, ref: 'User'
        },
    },
    {
        toJSON: {
            virtuals: true,
        },
        id: false,
    }
);

userSchema
    .virtual('friendCount')
    .get(function () {
        return `${this.username}`
    });

const User = model('user', userSchema);

module.exports = User;