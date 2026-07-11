import express from 'express'
import { addFood, listFood ,removeFood} from '../controllers/foodController.js'
import multer from 'multer'


const foodRouter = express.Router(); //Router created and we can createa get post and any other methods

//image storage Engine
const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}${file.originalname}`)
    }
})

const upload = multer({ storage: storage });

foodRouter.post("/add", upload.single("image"), addFood);  //to send the data to the server
foodRouter.get("/list",listFood);
foodRouter.post("/remove",removeFood);

export default foodRouter;

