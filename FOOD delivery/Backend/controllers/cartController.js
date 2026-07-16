import userModel from "../models/userModel.js";

// add items
const addToCart = async(req,res)=>{
    try{
        let userData = await userModel.findOne({_id:req.body.userId});
        let cartData = await userData.cartData;

        if(!userData){
            return res.json({success:false,message:"User not found"});
        }
        if(cartData[req.body.foodId]){
            cartData[req.body.foodId] += 1;
        }
        else{
            cartData[req.body.foodId] = 1;
        }

        await userModel.findByIdAndUpdate(req.body.userId, {cartData});
        res.json({success:true,message:"Added to cart"});
    } catch(error){
        console.log(error);
        res.json({success:false,message:"Error"});
    }
}
// remove items from user cart 
const removeFromCart = async(req,res)=>{
    try{
        let userData = await userModel.findOne({_id:req.body.userId});
        let cartData = await userData.cartData;

        if(!userData){
            return res.json({success:false,message:"User not found"});
        }
        if(cartData[req.body.foodId]){
            cartData[req.body.foodId] -= 1;
        }
        else{
            cartData[req.body.foodId] = 1;
        }

        await userModel.findByIdAndUpdate(req.body.userId, {cartData});
        res.json({success:true,message:"Added to cart"});
    } catch(error){
        console.log(error);
        res.json({success:false,message:"Error"});
    }
}

// fetch User Cart data
const getCart = async(req,res)=>{
    try{
        let userData = await userModel.findOne({_id:req.body.userId});
        let cartData = await userData.cartData;

        if(!userData){
            return res.json({success:false,message:"User not found"});
        }
        res.json({success:true,cartData});
    } catch(error){
        console.log(error);
        res.json({success:false,message:"Error"});
    }
}


export {addToCart,removeFromCart,getCart}