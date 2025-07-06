import { create } from 'superstruct';
import bcrypt from 'bcrypt';
import { prismaClient } from '../lib/prismaClient.js';
// 구조 정의는 직접 추가
import { CreateUserBodyStruct } from '../structs/usersStruct.js';

export async function registerUser(req, res) {
  // 1. 유효성 검사
  const { email, nickname, password } = create(req.body, CreateUserBodyStruct);

  // 2. 이메일 또는 닉네임 중복 확인
  const exists = await prismaClient.user.findFirst({
    where: { OR: [{ email }, { nickname }] },
  });
  if (exists) {
    return res.status(409).json({ message: '이미 사용중인 이메일 또는 닉네임입니다.' });
  }

  // 3. 비밀번호 해싱
  const hashed = await bcrypt.hash(password, 10);

  // 4. 저장
  const user = await prismaClient.user.create({
    data: {
      email,
      nickname,
      password: hashed,
      image: null, // 기본값
    },
    select: { id: true, email: true, nickname: true, image: true, createdAt: true, updatedAt: true }
  });

  return res.status(201).json(user);
}