import mongoose, { Schema, Document } from 'mongoose';

interface ILog extends Document {
  requestId: string;
  method: string;
  url: string;
  statusCode: number;
  timestamp: string;
  duration: number;
}

const logSchema: Schema = new Schema(
  {
    requestId: {
      type: String,
      required: true,
    },
    method: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    statusCode: {
      type: Number,
      required: true,
    },
    timestamp: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    movieId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Log = mongoose.model<ILog>('Log', logSchema);

export default Log;
