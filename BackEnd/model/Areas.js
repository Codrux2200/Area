const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const action_reaction = new Schema({
    _id: mongoose.SchemaTypes.ObjectId,
    args: [String],
});

const areaSchema = new Schema({
    name: String,
    user_id: mongoose.SchemaTypes.ObjectId,
    action: action_reaction,
    reaction: action_reaction,
    actif: Boolean
});

module.exports = mongoose.model('Areas', areaSchema);