const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const service = new Schema({
    _service_id: mongoose.SchemaTypes.ObjectId,
    access_token: String,
    refresh_token: String,
    user_id: String,
    actif: Boolean
});

const userSchema = new Schema({
    username: String,
    password: String,
    services: [service],
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
});

module.exports = mongoose.model('Users', userSchema);