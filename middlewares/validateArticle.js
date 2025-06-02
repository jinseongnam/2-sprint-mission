export function validateArticle(req, res, next) {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ message: "제목과 내용을 입력하세요." });
  }
  next();
}