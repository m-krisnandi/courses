import mongoose from "mongoose";
import { Password } from "../services/password";

const adminSchema = new mongoose.Schema({
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

adminSchema.pre('save', async function(done) {
    if(this.isModified('password')) {
        const hashed = await Password.toHash(this.get('password'));
        this.set('password', hashed);
    }
    done();
})

adminSchema.statics.build = (attrs) => {
    return new Admin(attrs);
}

const Admin = mongoose.model('Admin', adminSchema);

export { Admin };