import mongoose from 'mongoose';

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