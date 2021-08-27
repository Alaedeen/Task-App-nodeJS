import multer from 'multer'

const avatarUploader = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Please upload an image of type jpg, jpeg or png'))
    }
    cb(undefined, true)
  },
})

const fileUploadErrorHanler = (error, req, res, next) => {
  res.status(400).send({ error: error.message })
}

export { avatarUploader, fileUploadErrorHanler }
