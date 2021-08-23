
const User = require('../../dbTable/user')
const bcrypt = require('bcrypt')
function authController()
 {
     return {
         login(req,res){
             res.render('auth/login')
         },
     
         register(req,res){
             res.render('auth/register')
         },
           async postRegister(req,res){
            const {name,email,password } = req.body
            //console.log(req.body)

            // Validation of Request
            if(!name || !email|| !password){

                req.flash('error','All fields are required')
                req.flash('name',name)
                req.flash('email',email)
                return res.redirect('/register')
                
            }
            // Check if email already exists
            User.exists({email:email},(err,result)=>{
                if(result){
                req.flash('error','Email already existed')
                req.flash('name',name)
                req.flash('email',email)
                return res.redirect('/register')

                }
            })

            // For password protection

            const hashPassword = await bcrypt.hash(password,10)

            // Create a user in db
            const user = new User({
                name : name,
                email : email,
                password : hashPassword
            })

            user.save().then((user)=>{

                // Further Upgrade Loggin
                return res.redirect('/')

            }).catch(err=>{

                req.flash('error','Something went wrong')
                return res.redirect('/register')
            })
           
        }
     }
 }

 module.exports = authController