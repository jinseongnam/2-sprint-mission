import express from "express";
import prisma from "../prisma/prismaClient.js";
import { validateProduct } from "../middlewares/validateProduct.js";
import { upload } from "../middlewares/upload.js"
const router = express.Router();


router.post("/image", upload.single("image"), (req, res) => {
  res.json({ filePath: req.file.path });
});

router.post("/", validateProduct, async (req, res, next) => {
  try {
    const { name, description, price, tags } = req.body;
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: Number(price),
        tags: tags ?? [],
      },
    });
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
});

// 상품 목록
router.get("/", async (req, res, next) => {
  try {
    const { offset = 0, limit = 10, search = "" } = req.query;
    const where = search
      ? {
          OR: [
            { name: { contains: search } },
            { description: { contains: search } },
          ],
        }
      : {};
    const products = await prisma.product.findMany({
      where,
      skip: Number(offset),
      take: Number(limit),
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, price: true, createdAt: true },
    });
    res.json(products);
  } catch (err) {
    next(err);
  }
});

// 상품 상세 조회
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
    });
    if (!product) return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
    res.json(product);
  } catch (err) {
    next(err);
  }
});

// 상품 수정 (PATCH)
router.patch("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, price, tags } = req.body;
    const updated = await prisma.product.update({
      where: { id: Number(id) },
      data: { name, description, price: Number(price), tags },
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// 상품 삭제
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({
      where: { id: Number(id) },
    });
    res.json({ message: "상품이 삭제되었습니다." });
  } catch (err) {
    next(err);
  }
});

export default router;
