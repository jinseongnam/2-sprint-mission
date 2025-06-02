import express from "express";
import prisma from "../prisma/prismaClient.js";
import { validateComment } from "../middlewares/validateComment.js";

const router = express.Router();

// 댓글 등록 (POST /comments)
router.post("/", validateComment, (req, res, next) => {
  const { productId, articleId } = req.body;
  
  if ((!productId && !articleId) || (productId && articleId)) {
    return res.status(400).json({ message: "productId 또는 articleId 중 하나만 입력하세요." });
  }
  next();
}, async (req, res, next) => {
  try {
    const { content, productId, articleId } = req.body;
    const comment = await prisma.comment.create({
      data: {
        content,
        productId: productId ? Number(productId) : null,
        articleId: articleId ? Number(articleId) : null,
      },
    });
    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
});

// 댓글 목록 (GET /comments)
router.get("/", async (req, res, next) => {
  try {
    // cursor 방식 
    const { cursor, take = 10, productId, articleId } = req.query;
    const where = {};
    if (productId) where.productId = Number(productId);
    if (articleId) where.articleId = Number(articleId);

    const comments = await prisma.comment.findMany({
      where,
      ...(cursor
        ? { cursor: { id: Number(cursor) }, skip: 1 }
        : {}),
      take: Number(take),
      orderBy: { id: "asc" },
    });

    res.json(comments);
  } catch (err) {
    next(err);
  }
});

// 댓글 수정 (PATCH /comments/:id)
router.patch("/:id", validateComment, async (req, res, next) => {
  try {
    const { content } = req.body;
    const { id } = req.params;
    const updated = await prisma.comment.update({
      where: { id: Number(id) },
      data: { content },
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// 댓글 삭제 (DELETE /comments/:id)
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.comment.delete({
      where: { id: Number(id) },
    });
    res.json({ message: "댓글이 삭제되었습니다." });
  } catch (err) {
    next(err);
  }
});

export default router;
