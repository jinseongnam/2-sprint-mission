import express from "express";
import prisma from "../prisma/prismaClient.js";
import { validateArticle } from "../middlewares/validateArticle.js";
const router = express.Router();

// 게시글 등록 (POST /articles)
router.post("/", validateArticle, async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const article = await prisma.article.create({
      data: { title, content },
    });
    res.status(201).json(article);
  } catch (err) {
    next(err);
  }
});

// 게시글 목록 (GET /articles)
router.get("/", async (req, res, next) => {
  try {
    const { offset = 0, limit = 10, search = "" } = req.query;
    const where = search
      ? {
          OR: [
            { title: { contains: search } },
            { content: { contains: search } },
          ],
        }
      : {};
    const articles = await prisma.article.findMany({
      where,
      skip: Number(offset),
      take: Number(limit),
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, content: true, createdAt: true },
    });
    res.json(articles);
  } catch (err) {
    next(err);
  }
});

// 게시글 상세 조회 (GET /articles/:id)
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const article = await prisma.article.findUnique({
      where: { id: Number(id) },
    });
    if (!article) return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
    res.json(article);
  } catch (err) {
    next(err);
  }
});

// 게시글 수정 (PATCH /articles/:id)
router.patch("/:id", validateArticle, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const updated = await prisma.article.update({
      where: { id: Number(id) },
      data: { title, content },
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// 게시글 삭제 (DELETE /articles/:id)
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.article.delete({
      where: { id: Number(id) },
    });
    res.json({ message: "게시글이 삭제되었습니다." });
  } catch (err) {
    next(err);
  }
});

export default router;
