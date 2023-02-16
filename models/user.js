import mongoose from "mongoose";
import { Password } from "../services/password";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

// hash the password before saving
userSchema.pre('save', async function(done) {
    if(this.isModified('password')) {
        const hashed = await Password.toHash(this.get('password'));
        this.set('password', hashed);
    }
    done();
})

// hash the password before updating
userSchema.pre('findOneAndUpdate', async function(done) {
    if(this._update.password) {
        const hashed = await Password.toHash(this._update.password);
        this._update.password = hashed;
    }
    done();
})

userSchema.statics.build = (attrs) => {
    return new User(attrs);
}

const User = mongoose.model('User', userSchema);

export { User };