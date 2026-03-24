import mongoose from 'mongoose';

const debugHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  result: {
    type: Object, // Will store the parsed JSON response from Gemini
    required: true,
  },
}, { timestamps: true });

export default mongoose.model('DebugHistory', debugHistorySchema);
