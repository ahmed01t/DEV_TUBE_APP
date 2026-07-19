const asyncHandler=(requestHandler)=>{
 return (req,res,next)=>{
    Promise.resolve(requestHandler(req,res,next)).catch((error)=>{
        next(error)
    })
}
} 


export {asyncHandler};




// Higher order function(which can recieve function as a parameter and pass function also)
// const asynchandler=(fn)=>async(req,res,next)=>
//     {
//         try {
//             await fn(req,res,next);
//         } catch (error) {
//             res.status(error.code || 500).json({
//                 success :false,
//                 message:error.message
//             })
//         }
// }