const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: {type: String, required: true, minlength: 3, maxlength: 200 },
    email: {type: String, required: true, minlength: 3, maxlength: 200 , unique: true},
    password: {type: String, required: true, minlength: 3, maxlength: 1024 },
},
{
    timestamps: true,
}
);

const UserModel = new mongoose.model("User", UserSchema);
module.exports = UserModel;