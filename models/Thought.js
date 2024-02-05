const { Schema, model } = require('mongoose');
const reactionSchema = require('./Reaction')

const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      Required: true,
      minlength: 1,
      maxlength: 280,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    username: {
      type: String,
      Required: true,
    },
    reactions: [reactionSchema],
  },
);

thoughtSchema
    .virtual('reactionCount')
    .get(function () {
        return this.reactions.length;
})

const Thought = model('Thought', thoughtSchema);

module.exports = Thought;