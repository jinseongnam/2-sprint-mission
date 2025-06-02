// middlewares/upload.js
import multer from "multer";
import path from "path";

// 저장 경로 및 파일명 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // uploads 폴더에 저장
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext); // 파일명: 타임스탬프+확장자
  },
});

export const upload = multer({ storage });
