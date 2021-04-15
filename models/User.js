const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
name : {
	type : String,
	required : true
},
email : {
	type : String,
	required : true,
	unique : true
},
password : {
	type : String,
	required : true
},
lastname : {
	type : String,
	default: '' ,
	maxlength : 20
},
articles : {
	type: Array,
	default: []
},
admin:{
    type:Boolean,
    default:false
},
sex: { 
	type: String, 
	default: '' 
},
phone: { 
	type: String, 
	default: '' 
},
images : {
	type: Array,
    default: []
},
tokenExp : {
	type : Number
}
});

module.exports = User = mongoose.model("user",UserSchema)
