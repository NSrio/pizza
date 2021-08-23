
const LocalStrategy = require('passport-local').Strategy
const User = require('../dbTable/user')
const bycrypt = require('bcrypt')
function init(passport){

    passport.use(new LocalStrategy({usernameField:'email'}, async (email,password,done)=>{

        // Login
        // check if email existed in db

        const user = await User.findOne({email:email})
        if(!user){
            return done(null,false,{message : "No user with this email"})
        }
        bycrypt.compare(password,user.password).then(match =>{
            if(match){
                return done(null,user,{message : " Logged in succesfully"})
            }
            return done(null,false,{message : "Wrong username or password"})
        }).catch(err=>{
            return done(null,false,{message : "Somthing went wrong"})
        })
    }))

    // Picking user_id
    passport.serializeUser((user,done)=>{
        done(null,user._id)
    })
    passport.deserializeUser((id,done)=>{
        User.findById(id,(err,user)=>{
            done(err,user)
        })
    })

}
 
module.exports = init