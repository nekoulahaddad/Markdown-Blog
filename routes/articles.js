const mkdirp = require("mkdirp")
const express = require("express");
const router = express.Router();
const Article = require('../models/Article');
const auth = require('../middleware/auth')
const multer = require('multer'); // multer it is like bodyparser but bodyparse handles req.body and multer handles req.file
const aws = require( 'aws-sdk' );
const multerS3 = require( 'multer-s3' );
const path = require( 'path' );
const ACCESS_KEY_ID = require("../config/index").ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = require("../config/index").SECRET_ACCESS_KEY;
const BUCKET = require("../config/index").BUCKET;



//upload img on AWS S3 for static hosting like heroku
//amazon user information
const s3 = new aws.S3({
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
    Bucket: BUCKET
});

//upload a single img
const profileImgUpload = multer({
    storage: multerS3({
        s3: s3,
        bucket: BUCKET,
        acl: 'public-read',
        key: function (req, file, cb) {
            cb(null, path.basename( file.originalname, path.extname( file.originalname ) ) + '-' + Date.now() + path.extname( file.originalname ) )
        }
    }),
    limits:{ fileSize: 2000000 }, // In bytes: 2000000 bytes = 2 MB
    fileFilter: function( req, file, cb ){
        checkFileType( file, cb );
    }
}).single('profileImage');

//Check the file type (must be an image)
function checkFileType( file, cb ){
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test( path.extname( file.originalname ).toLowerCase());
    // Check mime
    const mimetype = filetypes.test( file.mimetype );
    if( mimetype && extname ){
        return cb( null, true );
    } else {
        cb( 'Error: Images Only!' );
    }
}

router.post( '/profile-img-upload', ( req, res ) => {
    profileImgUpload( req, res,  error  => {
        if( error ){
            res.json({ success: false, error })
        } else {
            // If File not found
            if( req.file === undefined ){
                res.json( 'Error: No File Selected' );
            } else {
                // If Success
                const imagetitle = req.file.key;
                const imageLocation = req.file.location;
                res.json( {
                    success: true,
                    image: imageLocation,
                    imagetitle: imagetitle
                } );
            }
        }
    });
});


// Multiple File Uploads ( max 4 )
const uploadsBusinessGallery = multer({
    storage: multerS3({
        s3: s3,
        bucket: BUCKET,
        acl: 'public-read',
        key: function (req, file, cb) {
            cb( null, path.basename( file.originalname, path.extname( file.originalname ) ) + '-' + Date.now() + path.extname( file.originalname ) )
        }
    }),
    limits:{ fileSize: 2000000 }, // In bytes: 2000000 bytes = 2 MB
    fileFilter: function( req, file, cb ){
        checkFileType( file, cb );
    }
}).array( 'galleryImage', 4 );

//route POST /api/profile/multiple-file-upload
router.post('/multiple-file-upload', ( req, res ) => {
    uploadsBusinessGallery( req, res, ( error ) => {
        if( error ){
            res.json( { error: error } );
        } else {
            // If File not found
            if( req.files === undefined ){
                res.json( 'Error: No File Selected' );
            } else {
                // If Success
                let fileArray = req.files,
                    fileLocation;
                const galleryImgLocationArray = [];
                for ( let i = 0; i < fileArray.length; i++ ) {
                    fileLocation = fileArray[ i ].location;
                    galleryImgLocationArray.push( fileLocation )
                }
                // Save the file title into database
                console.log(galleryImgLocationArray);
                res.json( {
                    filesArray: fileArray,
                    locationArray: galleryImgLocationArray
                } );
            }
        }
    });
});


router.post("/uploadPost",  (req, res) => {
    const article = new Article(req.body)
    article.save((err) => {
        if (err) return res.status(400).json({ success: false, err })
        return res.status(200).json(article)
    })
});


router.post("/getPosts", (req, res) => {

    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);

    let findArgs = {};
    let term = req.body.searchTerm;


    if (term) {
        Article.find(findArgs)
            .find({ $text: { $search: term } })
            .sort([[sortBy, order]])
            .skip(skip)
            .limit(limit)
            .exec((err, articles) => {
                if (err) return res.status(400).json({ success: false, err })
                res.status(200).json({ success: true, articles, postSize: articles.length })
            })
    } else {
        Article.find(findArgs)
            .sort([[sortBy, order]])
            .skip(skip)
            .limit(limit)
            .exec((err, articles) => {
                if (err) return res.status(400).json({ success: false, err })
                res.status(200).json({ success: true, articles, postSize: articles.length })
            })
    }

});



router.put("/editPost/:id",(req,res) => {
    const {title,description,markdown} = req.body
Article.findByIdAndUpdate({_id:req.params.id},
    {$set:{title,description,markdown}},{ new: true }
    )
.then(()=> Article.find()
.then((Articles)=> res.json(Articles))
.catch((err)=> err.status(500))
.catch((err)=> res.json(err))
)
});

router.get('/:slug', async (req, res) => {
  const article = await Article.findOneAndUpdate({ slug: req.params.slug },{$inc:{views:1}},{new:true})
  .then(() => Article.findOne({ slug: req.params.slug },(err,article) => {
    if (err) res.json(err);
    if (article == null) res.redirect('/articles');
    if (article) res.json(article)
  }))
});

router.delete('/:id',(req,res) => {
Article.findById(req.params.id)
.then(Article => Article.remove().then(() => res.json({success:true})))
.catch(err => res.status(404).json({success:false}))
});


//add comments
router.post('/:id/addComment',auth,(req,res) => {
    User.findById(req.user.id,
    (err, userInfo) => {
    if (err) return res.json({ success: false, err });
    const user = userInfo
    const {content} = req.body;
    if (!content) {
    return res.status(400).json({msg : "please fill all things"});
    }
    Article.findByIdAndUpdate({_id:req.params.id},
        {
        $push:{comment: {user:user.name,authorId:user._id,user_image:user.images[0],content:content}},
        $inc:{comment_count:1}
},

)
    .then(() => Article.findById(req.params.id)
        .then(Article=>res.json(Article))
        .catch(err=>err.status(500)))
    .catch(err => res.json(err)) 

})});



//edit comment
router.put('/editComment/:id',(req,res) => {
	const {content} = req.body;
	Article.findOneAndUpdate({_id:req.params.id,"comment._id":req.query.CommentId},
        {
            $set:{
                "comment.$.content": content
                //[{_id:req.query.commentId,content:content}]
                }
        })
	.then(() => Article.find()
		.then(Article=>res.json(Article))
		.catch(err=>err.status(500)))
    .catch(err => res.json(err))
});




//add Replies
router.delete('/deleteComment/:id',auth,(req,res) => {
    User.findById(req.user.id,
    (err, userInfo) => {
    if (err) return res.json({ success: false, err });
    const user = userInfo
    Article.update(
                { _id: req.params.id, "comment._id": req.query.CommentId },
                { $pull:{"comment": {"_id":req.query.CommentId}  } })
    .then(() => Article.findById(req.params.id)
        .then(Article=>res.json(Article))
        .catch(err=>err.status(500)))
    .catch(err => res.json(err)) 

})});


router.post('/addReply/:id',auth,(req,res) => {
    User.findById(req.user.id,
    (err, userInfo) => {
    if (err) return res.json({ success: false, err });
    const user = userInfo
    const {Reply_content} = req.body;
    if (!Reply_content) {
    return res.status(400).json({msg : "please fill all things"});
    }
    Article.updateOne(
                { _id: req.params.id, "comment._id": req.query.CommentId },
                { $inc: { "comment.$.reply_count": 1 },
                $push:{"comment.$.replies": {parent:req.query.CommentId,authorId:user._id,user:user.name,content:Reply_content,date:Date.now()}}
    })
    .then(() => Article.findById(req.params.id)
        .then(Article=>res.json(Article))
        .catch(err=>err.status(500)))
    .catch(err => res.json(err)) 

})});


module.exports = router;