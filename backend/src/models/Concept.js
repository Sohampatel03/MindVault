import mongoose from 'mongoose';


const quizSchema = new mongoose.Schema(
{
question: String,
options: [String],
answer: String
},
{ _id: false }
);


const conceptSchema = new mongoose.Schema(
{
userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
folderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder', required: true },
conceptName: { type: String, required: true },
description: { type: String },
imageUrl: { type: String },
ocrText: { type: String },
quiz: [quizSchema] // we’ll store 1 question for now
},
{ timestamps: true }
);


export default mongoose.model('Concept', conceptSchema);