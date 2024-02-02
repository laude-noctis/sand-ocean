const mongoose = require('mongoose');
const { Schema, Types } = require('mongoose');

const reactionSchema = new Schema({
    reactionId: {
        type: Types.ObjectId,
        default: () => new mongoose.Types.ObjectId(),
    },
    reactionBody: {
        type: String,
        Required: true,
        maxlength: 280,
    },
    username: {
        type: String,
        Required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = reactionSchema;