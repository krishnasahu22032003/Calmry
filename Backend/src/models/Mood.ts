import mongoose, { Document, model, Schema } from "mongoose"

interface Mood extends Document{

     userId: mongoose.Types.ObjectId;
  score: number;
  note?: string;
  context?: "work" | "personal" | "health" | "social" | "other";
  activities:string[]
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
    context:{
        type:String,
        trim:true,
            enum: ["work", "personal", "health", "social", "other"],
    },
    activities:{
        type:[String],
        default:[]
    }
  },{timestamps:true}
)

MoodSchema.index({ userId: 1, timestamp: -1 });

const Mood = model<Mood>("Mood",MoodSchema)

export default Mood
