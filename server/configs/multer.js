import multer from "multer";


const storgae = multer.diskStorage({});

const upload = multer([storgae]);

export default upload;