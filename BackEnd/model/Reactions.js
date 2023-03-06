const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reactionSchema = new Schema({
    name: String,
    description: String,
    args: [String]
});

module.exports = mongoose.model('Reactions', reactionSchema);