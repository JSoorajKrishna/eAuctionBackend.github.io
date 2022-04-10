const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const {isEmail} = require("validator");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: [true,'Please enter an email'],
        unique: true,
        validate: [isEmail, 'Enter a valid email id']
    },
    password: {
        type: String,
        required: [true,'Please enter a password'],
        minlength: [4,'Min. password length is 4 characters']
    }
});

UserSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

UserSchema.statics.login = async function(email,password){
    const user = await this.findOne({email});
    if(user)
    {
        const auth = await bcrypt.compare(password,user.password);
        if(auth)
        {
            return user;
        }
        throw Error('incorrect password');
    }
    throw Error('Incorrect email');
};

const User = mongoose.model('user',UserSchema);

module.exports = {User};