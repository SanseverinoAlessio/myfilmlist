const multer = require('multer');
var path = require('path');
const storage =
multer.diskStorage({
  destination: path.join(__dirname,"../public/images"),
  filename: (req,file,cb)=>{
    let types = 'jpe?g|png|gif|bmp';
    let fileType = file.mimetype;
    let ext = fileType.match(types);
    return cb(null, Date.now() + '.' + ext);
  }
});
const upload = multer(
  {fileFilter: (req,file,cb)=>{
    let fileType = file.mimetype;
    let types = new RegExp('/jpe?g|png|gif|bmp/');
    if(!types.test(fileType)){
      cb(null,false);
      return cb(new Error('Sono permessi solo file: .jpg, .jpeg, .png, .gif, .bmp'));
    }
    return cb(null,true);
  },
  storage: storage,
}
);
module.exports = upload;
