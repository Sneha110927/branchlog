import mongoose, { Schema, model, models } from 'mongoose';

const RecordSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    environment: {
        type: String,
        required: true,
        enum: ['DEV', 'UAT', 'LIVE'],
    },
    branch: {
        type: String,
        required: true,
    },
    taskId: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: String,
    diff: {
        type: String,
        required: true,
    },
    summary: String, // AI Generated
    tags: [String],
    author: String, // Display name
    filesChanged: {
        type: Number,
        default: 0
    },
    linesAdded: {
        type: Number,
        default: 0
    },
    linesRemoved: {
        type: Number,
        default: 0
    },
    fileNames: [String],
}, { timestamps: true });

const Record = models.Record || model('Record', RecordSchema);

export default Record;
