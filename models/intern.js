const mongoose = require('mongoose');

const internSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String },
  fullName: { type: String },
  role: { type: String, default: 'intern' },
  joinedAt: { type: Date, default: Date.now },
  donations: { type: Number, default: 0 } 
});

module.exports = mongoose.model('Intern', internSchema, 'interns'); 