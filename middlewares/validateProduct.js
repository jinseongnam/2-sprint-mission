
import { object, string, number, array, validate } from "superstruct";

// 상품 등록/수정 입력값 구조 정의
const ProductStruct = object({
  name: string(),
  description: string(),
  price: number(),
  tags: array(string()),
});

// 미들웨어 함수
export function validateProduct(req, res, next) {
  const [error] = validate(req.body, ProductStruct);
  if (error) {
    return res.status(400).json({
      message: "입력값 오류: " + error.message,
    });
  }
  next();
}
