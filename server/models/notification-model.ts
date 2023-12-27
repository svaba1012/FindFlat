import mongoose, { Schema } from "mongoose";
import { User } from "./user-model";

interface NotificationDoc {
  filter: string;
  user: mongoose.Types.ObjectId | undefined;
  turned: Boolean;
}

const NotificationSchema = new Schema<NotificationDoc>(
  {
    filter: { type: String, required: true },
    user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    turned: { type: Boolean, required: true },
  },
  {
    toJSON: {
      transform(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

const Notification = mongoose.model<NotificationDoc>(
  "Notification",
  NotificationSchema
);

export { Notification };
