const asyncHandler = (requestHandler) =>{
    (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next))
        .catch((err)=>{
            next(err)
        })
    }}



export { asyncHandler }




//higher order function

//const asyncHandler = (fn) => {(req,res,next)=>{}}


// const asyncHandler = (fn) => async (req,res,next) =>{
//     try {
//         await fn(req,res,next)
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success:false,
//             message:err.message
//         })
//     }
// }      

