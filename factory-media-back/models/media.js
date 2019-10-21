const mongoose =require('mongoose');

const mediaSchema = new mongoose.Schema({
    title: String,
    type: String,
    fileType: String,
    url: String,
}, { timestamps: { createdAt: 'created_at' } });

const Media = mongoose.model('Media',mediaSchema);

exports.mediaSchema = mediaSchema;
exports.Media = Media; 