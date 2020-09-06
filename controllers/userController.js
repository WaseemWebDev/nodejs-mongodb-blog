const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const users = require('../modals/User');
const loadSignUp = (req, res) => {
    const  title = "home";
    const errors = [];
    const inputs = {};
    res.render("register", { title, errors, inputs ,login:false})
  }

  const loadLogin = (req, res) => {
    title = "login"
    res.render("login", { title,errors:[] ,login:false})
  }
  const registerValidation =  [
    check('name').isLength({ min: 3 }).withMessage('must be at least 3 chars long'),
    check('email').isEmail().withMessage('email must b valid'),
    check('password').isLength({ min: 5 }).withMessage('must be at least 5 chars long')
  ];

  const userRegistration = async (req, res) => {
    title = "create new account";
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("register", { title, errors: errors.array(), inputs: req.body ,login:false})
    } else {
      try {
        const {name,email,password} = req.body;
        const userEmail = await users.findOne({ email })
        if (userEmail === null) {
            const salt = await bcrypt.genSalt(10)
            const hashed = await bcrypt.hash(password, salt)
            console.log("Your salt: ", salt)
            const newUser = new users({
                name: name,
                email: email,
                password: hashed
  
            })
            try {
                const createdUser = await newUser.save();
                req.flash('success', "Your account has been created successfully");
                res.redirect('/login');
            } catch (err) {
                console.log(err.message)
            }
        } else {
            res.render("register", { title: 'Create new account', errors: [{ msg: 'Email is already exist' }], inputs: req.body, login: false })
        }
    } catch (err) {
        console.log(err.message)
    }
  }
  
  }

  const loginCheck =[
   
    check('email').not().isEmpty().withMessage('email can not be empty'),
    check('password').not().isEmpty().withMessage('password can not be empty')
  ]

  const login  = async (req,res)=>{
      const {email,password} = req.body;
    const errors = validationResult(req);
   
    if (!errors.isEmpty()) {
       
       res.render('login',{title:"login" , errors:errors.array(),login:false})
      }
      else{
          try{
            const emailFound = await users.findOne({email});
            if(emailFound !== null){
                const id = emailFound._id;
                const passwordDb = emailFound.password;
                const passwordVerify = await bcrypt.compare(password,passwordDb);
                if (passwordVerify){
                    const token =  jwt.sign({ userId: id }, process.env.JWT_SECRET,{
                        expiresIn:"3d"
                    })
                    req.session.user = token;
                    res.redirect('/profile');
                    
                }
                else{
                    res.render('login',{title:"login" , errors:[{msg:"password does not found"}],login:false})
                }
                
            }
            else{
                res.render('login',{title:"login" , errors:[{msg:"email does not found"}],login:false})
            }
          }
          catch(error){
              console.log(error.message);
          }
        
      }
  }

  module.exports={
      loadSignUp,
      loadLogin,
      registerValidation,
      userRegistration,
      loginCheck,
      login
      
  }