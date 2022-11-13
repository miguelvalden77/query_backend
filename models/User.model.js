const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true,
    },
    friends: [{
      type: Schema.Types.ObjectId,
      ref: "User"
    }],
    comments: [{
      type: Schema.Types.ObjectId,
      ref: "Comment"
    }],
    posts: [{
      type: Schema.Types.ObjectId,
      ref: "Post"
    }],
    role:{
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },
    postsLike:[{
      type: String
    }]
  },
  {    
    timestamps: true
  }
);

const User = model("User", userSchema);

module.exports = User;
