export function validateComment(req, res, next) {
  const { content } = req.body;
  if (!content) {
    return res.status(400).json({ message: "댓글 내용을 입력하세요." });
  }
  next();
}