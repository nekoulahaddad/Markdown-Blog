const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const marked = require('marked')
const slugify = require('slugify')
const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const dompurify = createDomPurify(new JSDOM().window)



const CommentSchema = new Schema({
    authorId: String,
    user: String,
    content: String,
    user_image:String,
    like: {type: Number, default: 0},
    date: {type: Date, default:Date.now },
    reply_count: {type: Number, default: 0},
    replies:{
    type: Array,
    default: []}
})    

const ArticleSchema = new Schema({
title: {
	type : String,
	required : true
},
description:{
	type : String
},
category : {
    type : String,
    default: "Programming"
},
images : {
	type: Array,
    default: []
},
markdown: {
    type: String,
    required: true
},
slug: {
    type: String,
    required: true,
    unique: true
},
sanitizedHtml: {
    type: String,
    required: true
},
date : {
	type : Date,
	default : Date.now
},
likes :{
    type:Number,
    default: 0
},
comment_count: {
    type: Number, default: 0
},
comment :[CommentSchema],
views: {
    type: Number,
    default: 0
}
}, { timestamps: true }) // hie she3`le mnshan ye6la3 created at .. updated at
// al index had shee jedan mohem mnshan al search ... hal2 2na 9ar feny 23mel search bel data base w bs 2ktob shee klme bedawer 3leha bel title w al description

ArticleSchema.pre('validate', function(next) {
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true }) // it used to put the title in the url, cuz in the url i can't use spaces(' ')
  }

  if (this.markdown) {
    this.sanitizedHtml = dompurify.sanitize(marked(this.markdown))
  }

  next()
})


ArticleSchema.index({ // we use indexes to find data depending on some queries like title and description, i don't need to make a lot of indexes cuz it costs a lot, makes the program run slow
    title:'text',
    description: 'text',
}, {
    weights: {
        name: 5,
        description: 1,
    }
})


module.exports = Article = mongoose.model("Article",ArticleSchema)

