import mongoose from "mongoose"
import { IMessage } from "./types"

const messageSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "chat",
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },

    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

const Message =
  mongoose.models.message ||
  mongoose.model<IMessage>("message", messageSchema)

export default Message