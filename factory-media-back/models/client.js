const mongoose =require('mongoose');
const {mediaSchema} = require('./media');



const clientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    description: {
        type: String,
        required: true,
        minlength: 5,
        
    },
    webSite: {
        type: String,
    },
    medias : [mediaSchema]
}, { timestamps: { createdAt: 'created_at' } });


const Client = mongoose.model('Client',clientSchema);



exports.clientSchema = clientSchema;
exports.Client = Client; 