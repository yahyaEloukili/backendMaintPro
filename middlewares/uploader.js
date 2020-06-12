const Multer = require('multer');

function addfileIntoRequest(req,res,next) {
    const {image} = req.body;
    if(!image){
        return next();
    }
    req['file'] = {};
    req.file['file'] = image;
    req.file['mimetype'] = 'image/jpeg';
    return next();
}

let storage = Multer.diskStorage({


    destination: (req, file, cb) => {
        cb(null, __dirname+'/../uploads');
    },
    filename: (req, file, cb) => {
        var filetype = '';
        if(file.mimetype === 'image/gif') {
            filetype = 'gif';
        }
        if(file.mimetype === 'image/png') {
            filetype = 'png';
        }
        if(file.mimetype === 'image/jpeg') {
            filetype = 'jpg';
        }
        cb(null, 'image-' + Date.now() + '.' + filetype);
    }
});
const upload = Multer({storage: storage});

module.exports.upload = upload;
module.exports.addfileIntoRequest = addfileIntoRequest;
