var mongoose=require("mongoose");
var cmntSchema=new mongoose.Schema({comment:String,
									author:{type:String}})
module.exports=(mongoose.model("comments",cmntSchema));