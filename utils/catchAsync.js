module.exports = func =>{
    return async (req,res,next)=>{
        func(req,res,next).catch(next);
    }
}