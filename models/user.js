var mongoose=require("mongoose"),
	passportLocalMongoose=require("passport-local-mongoose");
var userSchema= new mongoose.Schema({
	username:String,
	password:String,
	email:{type:String,unique:true,required:true},
	firstname:{type:String,lowercase:true,required:true},
	lastname:{type:String,lowercase:true,required:true}
})
userSchema.plugin(passportLocalMongoose);
module.exports= mongoose.model("user",userSchema);