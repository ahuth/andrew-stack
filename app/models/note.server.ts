import type {Note} from '@prisma/client';

import {prisma} from '~/db.server';

export type {Note} from '@prisma/client';

export function getNote({id, userId}: Pick<Note, 'id' | 'userId'>) {
  return prisma.note.findFirst({
    select: {id: true, body: true, title: true},
    where: {id, userId},
  });
}

export function getNoteListItems({userId}: {userId: string}) {
  return prisma.note.findMany({
    where: {userId},
    select: {id: true, title: true},
    orderBy: {updatedAt: 'desc'},
  });
}

export function createNote({
  body,
  title,
  userId,
}: Pick<Note, 'body' | 'title' | 'userId'>) {
  return prisma.note.create({
    data: {
      title,
      body,
      userId,
    },
  });
}

export function deleteNote({id, userId}: Pick<Note, 'id' | 'userId'>) {
  return prisma.note.deleteMany({
    where: {id, userId},
  });
}
