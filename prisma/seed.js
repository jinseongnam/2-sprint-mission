
import dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  
  await prisma.product.createMany({
    data: [
      { name: "중고 노트북", description: "상태 좋음", price: 350000, tags: ["전자제품", "노트북"] },
      { name: "책상", description: "소형 책상", price: 40000, tags: ["가구"] },
    ],
  });

  
  await prisma.article.createMany({
    data: [
      { title: "안녕하세요", content: "첫 게시글입니다!" },
      { title: "중고마켓 소개", content: "여기는 중고 거래 게시판" },
    ],
  });
}

main()
  .then(() => { console.log("시딩 완료!"); })
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());