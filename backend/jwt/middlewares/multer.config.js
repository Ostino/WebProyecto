import multer from 'multer';


const storage = multer.memoryStorage(); 

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, 
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/; 
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(file.originalname.split('.').pop().toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Error: El archivo debe ser una imagen válida'));
        }
    }
});

// Exportar el middleware de multer
export default upload;
