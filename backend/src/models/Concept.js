import mongoose from 'mongoose';


// const quizSchema = new mongoose.Schema(
// {
// question: String,
// options: [String],
// answer: String
// },
// { _id: false }
// );


// const conceptSchema = new mongoose.Schema(
// {
// userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
// folderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder', required: true },
// conceptName: { type: String, required: true },
// description: { type: String },
// imageUrl: { type: String },
// question: { // Single question object
//     question: String,
//     options: [String], 
//     answer: String
//   }, // we’ll store 1 question for now
// },
// { timestamps: true }
// );


// export default mongoose.model('Concept', conceptSchema);

// backend/src/models/Concept.js - IMPORTANT FIXES
const conceptSchema = new mongoose.Schema(
{
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  folderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder', required: true },
  conceptName: { type: String, required: true }, // ✅ Fixed field name
  description: { type: String },
  imageUrl: { type: String },
  question: {
    question: String,
    options: [String], 
    answer: String
  }
},
{ timestamps: true }
);

export default mongoose.model('Concept', conceptSchema);