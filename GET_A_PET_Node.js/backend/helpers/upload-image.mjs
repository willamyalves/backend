import multer from "multer";
import path from "path";

// Destination to store the images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "";

    if (req.baseUrl.includes("users")) {
      console.log(req);
      folder = "users";
    }
    if (req.baseUrl.includes("pets")) {
      folder = "pet";
    }
    cb(null, `public/images/${folder}`);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const imageUpload = multer({
  storage,
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg)$/)) {
      return cb(new Error("Por favor, envie apenas jpg ou png!"));
    }
    cb(undefined, true);
  },
});

export default imageUpload;
