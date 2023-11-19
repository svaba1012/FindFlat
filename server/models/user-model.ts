import mongoose from "mongoose";

interface UserDoc {
  username: string;
  email: string;
  password: string;
  verified: boolean;
}

const UserSchema = new mongoose.Schema<UserDoc>(
  {
    username: { required: true, unique: true, type: String },
    email: { type: String, required: true },
    password: { type: String, require: true },
    verified: { type: Boolean, require: true },
  },
  {
    toJSON: {
      transform(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
      },
    },
  }
);

const User = mongoose.model<UserDoc>("User", UserSchema);

export { User };
