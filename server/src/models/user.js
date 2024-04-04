import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      lowercase: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      match: [
        /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/,
        "Please provide a valid email",
      ],
    },
    password: {
      type: String,
      required: true,
    },
    profilePhoto: {
      type: String,
      default:
        "https://res.cloudinary.com/ceenobi/image/upload/v1709243852/icons/unnamed_fuwmdn.webp",
    },
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

export default User;
