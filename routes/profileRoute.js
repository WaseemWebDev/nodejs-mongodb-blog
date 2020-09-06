const express = require('express');
const router = express.Router();
const {profileLoad,logout} = require('../controllers/profileController');
const { showpostForm,createPost,showSpecificPost,deletePost,updateDetails,updatePost} = require('../controllers/postController')
const  {auth}  = require('../middlewares/auth');

router.get('/profile',auth,profileLoad)
router.get('/profile/:page',auth,profileLoad)
router.get('/logout',logout)
router.get('/showpost',auth,showpostForm)
router.post('/createpost',createPost)
router.get('/postdetails/:id',auth,showSpecificPost)
router.post('/deletepost',auth,deletePost)
router.get('/updatedetails/:postid',updateDetails)
router.post('/updatepost',auth,updatePost)
module.exports = router;