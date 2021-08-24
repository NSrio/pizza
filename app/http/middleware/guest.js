function guest(req,res,next){
    if(!req.isAuthenticated()){
        return next()
    }
    return res.redirected('/')
}
module.exports = guest