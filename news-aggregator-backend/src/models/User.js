const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    role: {
      type: String,
      enum: ["user", "moderator", "admin"],
      default: "user",
    },
    reputation: { type: Number, default: 0 },
    articlesVerified: { type: Number, default: 0 },
    articlesSubmitted: { type: Number, default: 0 },
    accuracyRate: { type: Number, default: 0 }, // Percentage
    badges: [{ type: String }], // ['Expert', 'Trusted', 'Top Contributor']
    level: { 
      type: String, 
      enum: ['Novice', 'Advanced', 'Expert', 'Master'],
      default: 'Novice'
    },
    specialties: [{ type: String }], // ['Science', 'Politics', 'Technology']
    joinDate: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
    lastActiveAt: { type: Date, default: Date.now },
    totalVotes: { type: Number, default: 0 },
    correctPredictions: { type: Number, default: 0 },
    bio: { type: String, maxlength: 500 },
    website: { type: String },
    location: { type: String }
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
