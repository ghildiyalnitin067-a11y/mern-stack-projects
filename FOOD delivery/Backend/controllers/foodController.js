import foodModel from "../models/foodModel.js";
import { cloudinary } from "../config/cloudinary.js";


//add food item

const addFood = async (req, res) => {

    if (!req.file) {
        return res.json({ success: false, message: "Image file is required" });
    }

    // multer-storage-cloudinary puts the Cloudinary URL in req.file.path
    let image_url = req.file.path;

    const food = new foodModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: image_url,
    })
    try {
        await food.save();
        res.json({ success: true, message: "food added" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error" })
    }
}

//  all food list
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({});
        res.json({ success: true, data: foods })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error" })
    }
}

//remove food item
const removeFood = async (req, res) => {
    try {
        const food = await foodModel.findById(req.body.id);
        if (!food) {
            return res.json({ success: false, message: "Food not found" });
        }

        // Extract Cloudinary public_id from the URL and delete the image
        if (food.image) {
            // URL format: https://res.cloudinary.com/<cloud>/image/upload/v123/food-delivery/filename.ext
            const parts = food.image.split('/');
            const filenameWithExt = parts[parts.length - 1];
            const folder = parts[parts.length - 2];
            const publicId = `${folder}/${filenameWithExt.split('.')[0]}`;
            await cloudinary.uploader.destroy(publicId);
        }

        await foodModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "food removed" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error" })
    }
}


export { addFood, listFood, removeFood };