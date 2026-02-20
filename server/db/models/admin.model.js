import mongoose from "mongoose";
import bcrypt from "bcrypt";

const adminSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    default: "admin"
  },
  online: {
    type: Boolean,
    default: false
  },
  socketId: String,
  
  verified: {
    type: Boolean,
    default: false
  },
   otpCode: String,
  otpExpire:Date,

}, {
  timestamps: true
});
adminSchema.pre('save',function(){
    
if(this.isModified('password') && !this.password.startsWith('$2')){
    this.password = bcrypt.hashSync(this.password , 8)
}
})

export default mongoose.model("Admin", adminSchema);
