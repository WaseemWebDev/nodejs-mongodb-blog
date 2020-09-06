const posts = require('../modals/post');
const multer = require('multer');
const path = require('path');



const showpostForm = (req, res) => {
    res.render('post', { title: "create post", errors: [], login: true, userID: req.id });
}
const createPost = (req, res) => {
    // Set The Storage Engine
    const storage = multer.diskStorage({
        destination: './views/uploads',
        filename: function (req, file, cb) {
            cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        }
    });

    // Init Upload
    const upload = multer({
        storage: storage,
        limits: { fileSize: 1000000 },
        fileFilter: function (req, file, cb) {
            checkFileType(file, cb);
        }
    }).single('myImage');

    // Check File Type
    function checkFileType(file, cb) {
        // Allowed ext
        const filetypes = /jpeg|jpg|png|gif/;
        // Check ext
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        // Check mime
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: Images Only!');
        }
    }

    upload(req, res, (err) => {
        if (err) {
            res.render('post', {
                msg: err,
                userID: req.id,
                login: true,
            });
        } else {
            if (req.file == undefined) {
                res.render('post', {
                    msg: 'Error: No File Selected!'
                    ,title:"upload post"
                });
            } else {
                filename = req.file.filename;
                const newPost = new posts({
                    userId: req.body.userid,
                    name: req.body.postname,
                    description: req.body.description,
                    image: req.file.filename

                })

                newPost.save().then((data) => {

                    res.render('post', {
                        msg: 'File Uploaded!',
                        file: `${req.file.filename}`,
                        userID: req.id,
                        login: true,
                        title:'upload post'
                    });

                }).
                    catch(err => {
                        console.log(err.message)
                    })


            }
        }
    });



}

const showSpecificPost = (req,res)=>{
 const postId  = req.params.id;

  posts.findOne({_id:postId}).then((data)=>{
     res.render('showPostDetails',{data,login:true,title:"post details"})
 }).catch((err)=>{
     console.log(err.message);
 })
}
const deletePost = (req,res)=>{
    const postId =  req.body.postid;
  
posts.findOneAndDelete({ _id: postId }, function (err) {
  if(!err) {
      res.render('profile',{title:"home"});
  }
  else{
    console.log(err);
  }
    
});
}
const updateDetails  =  (req,res)=>{
    const postId = req.params.postid;
         posts.find({_id:postId}).then((data)=>{
    
    res.render('updatePostDetails',{login:true,data,title:'Update post'})
   }).catch((err)=>{
       console.log(err.message);
   })
    
}
const updatePost = (req,res)=>{
    const postName = req.body.postname;
    const description = req.body.description;
    const id = req.body.postid;
  
    posts.findByIdAndUpdate(id, { name: postName , description:description}, 
    function (err, docs) { 
if (err){ 
console.log(err) 
} 
else{ 
res.render('profile',{title:"home"}); 
} 
}); 
}
module.exports = {
    showpostForm,
    createPost,
    showSpecificPost,
    deletePost,
    updateDetails,
    updatePost
}