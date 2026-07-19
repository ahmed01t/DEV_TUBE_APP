import multer from "multer";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
// middleware (jata jata mujh sa milta jana)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp1")
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

 export const upload = multer({ storage: storage })

