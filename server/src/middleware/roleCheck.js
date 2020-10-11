module.exports = function roleCheck(role){
    return async function (req,res,next) {
        if(req.session.role === role){
            next();
        }
        else{
            return res.status(403).json({
                message:"This user not perform this action",
                type:"Unauthorized Access",
                error:`Expected user to have ${role}`
            })
        }
    }
}

