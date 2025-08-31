// backend/src/models/QuizResult.js
import mongoose from 'mongoose';

const quizResultSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    folderId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Folder', 
      required: true 
    },
    answers: {
      type: Map,
      of: String, // conceptId -> selected answer (A/B/C/D)
      required: true
    },
    timeElapsed: { 
      type: Number, 
      required: true 
    }, // in seconds
    totalQuestions: { 
      type: Number, 
      required: true 
    },
    correctAnswers: { 
      type: Number, 
      required: true 
    },
    percentage: { 
      type: Number, 
      required: true,
      min: 0,
      max: 100 
    },
    completedAt: { 
      type: Date, 
      default: Date.now 
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for grade calculation
quizResultSchema.virtual('grade').get(function() {
  if (this.percentage >= 90) return 'A+';
  if (this.percentage >= 80) return 'A';
  if (this.percentage >= 70) return 'B';
  if (this.percentage >= 60) return 'C';
  if (this.percentage >= 50) return 'D';
  return 'F';
});

// Index for faster queries
quizResultSchema.index({ userId: 1, folderId: 1, completedAt: -1 });

export default mongoose.model('QuizResult', quizResultSchema);