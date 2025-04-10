import mongoose, { Document, Schema } from "mongoose";

// Define the interface for Message
export interface IMessage extends Document {
  sender: string;
  sql_query: string;
  analysis: string;
  request_id: string;
  thread_id: string;
}

// Create Schema
const MessageSchema: Schema = new Schema(
  {
    sender: { type: String },
    sql_query: { type: String  },
    analysis: { type: String  },
    request_id: { type: String, required: true },
    thread_id: { type: String, required: true },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt
  }
);

// Create Model
const chatMessage = mongoose.model<IMessage>("Message", MessageSchema);

export default chatMessage;
