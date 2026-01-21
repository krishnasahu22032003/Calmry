import mongoose, { model, Schema } from "mongoose"

interface Mood{

     userId: mongoose.Types.ObjectId;
  score: number;
  note?: string;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MoodSchema = new mongoose.Schema<Mood>({
     userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    note: {
      type: String,
      trim: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },{timestamps:true}
)

MoodSchema.index({ userId: 1, timestamp: -1 });

const Mood = model<Mood>("mood",MoodSchema)

export default Mood
