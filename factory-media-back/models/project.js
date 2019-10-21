const mongoose =require('mongoose');
const {mediaSchema} = require('./media');
const {Client} = require('./client');


const projectSchema = new mongoose.Schema({
    title: String,
    description: String,
    content: String,
    client:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client'
    },
    medias : [mediaSchema]
}, { timestamps: { createdAt: 'created_at' } });


const Project = mongoose.model('Project',projectSchema);



exports.projectSchema = projectSchema;
exports.Project = Project; 