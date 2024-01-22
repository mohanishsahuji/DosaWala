import ErrorHandler from "../utils/ErrorHandler.js"

export const isAuthenticated=(req,res,next)=>{
    const token=req.cookies["connect.sid"]
  if(!token){
    return next(new ErrorHandler("Not Logged In",402))
  }
    next()
}
export const authorizeAdmin=(req,res,next)=>{
    const token=req.cookies["connect.sid"]
  if(req.user.role!=="admin"){
    return next(new ErrorHandler("Only Admin Allowed",405))
  }
    next()
}

 // await mongoose.connect("mongodb://mohanishsahu780:PfEYvmZZJJQDWBWL@ac-xb7emyf-shard-00-00.wyqwb3r.mongodb.net:27017,ac-xb7emyf-shard-00-01.wyqwb3r.mongodb.net:27017,ac-xb7emyf-shard-00-02.wyqwb3r.mongodb.net:27017/?ssl=true&replicaSet=atlas-3l4zuh-shard-0&authSource=admin&retryWrites=true&w=majority");
      
