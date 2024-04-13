import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    f_name: {
        type: String,
        required: true,
    },
    l_name: String,
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    pic: {
        type: String,
        default: 'https://res.cloudinary.com/drgcwhci4/image/upload/v1712742384/czvjcgbpvixn7p3t25ns.png'
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
})

const User = mongoose.model("User", userSchema);

export default User;
