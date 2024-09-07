import type {User} from '@prisma/client';
import bcrypt from 'bcryptjs';
import {prisma} from '~/db.server';

export type {User} from '@prisma/client';

export function getUserById(id: User['id']) {
  return prisma.user.findUnique({where: {id}});
}

export function getUserByEmail(email: User['email']) {
  return prisma.user.findUnique({where: {email}});
}

export async function createUser(email: User['email'], password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      email,
      hashedPassword,
    },
  });
}

export function deleteUserByEmail(email: User['email']) {
  return prisma.user.delete({where: {email}});
}

export async function verifyLogin(
  email: User['email'],
  password: User['hashedPassword'],
) {
  const userWithPassword = await prisma.user.findUnique({
    where: {email},
  });

  if (!userWithPassword) {
    return null;
  }

  const isValid = await bcrypt.compare(
    password,
    userWithPassword.hashedPassword,
  );

  if (!isValid) {
    return null;
  }

  const {hashedPassword: _password, ...userWithoutPassword} = userWithPassword;

  return userWithoutPassword;
}
