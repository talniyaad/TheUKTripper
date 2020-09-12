var mongoose=require("mongoose");
var blogSchema=new mongoose.Schema({
	title:String,
	image:String,
	date:{type:Date, default:Date.now},
	data:String,
	comments:[{type:mongoose.Schema.Types.ObjectId,ref:"comments"}],
	author:{type:String,default:"Anonymous"}}
);
module.exports= mongoose.model("blog",blogSchema);
