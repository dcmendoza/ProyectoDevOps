import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('password123', 10);

  const ana = await prisma.user.upsert({
    where: { email: 'ana@demo.com' },
    update: {},
    create: { name: 'Ana Demo', email: 'ana@demo.com', password }
  });

  const luis = await prisma.user.upsert({
    where: { email: 'luis@demo.com' },
    update: {},
    create: { name: 'Luis Demo', email: 'luis@demo.com', password }
  });

  const board = await prisma.board.create({
    data: {
      name: 'Proyecto Universidad',
      description: 'Tablero demo para CI/CD',
      ownerId: ana.id,
      members: {
        create: [
          { userId: ana.id, role: 'OWNER' },
          { userId: luis.id, role: 'MEMBER' }
        ]
      }
    }
  });

  const todo = await prisma.list.create({ data: { name: 'To Do', position: 0, boardId: board.id } });
  const doing = await prisma.list.create({ data: { name: 'Doing', position: 1, boardId: board.id } });

  await prisma.task.createMany({
    data: [
      { title: 'Configurar CI', description: 'Crear workflow de CI', status: 'TODO', listId: todo.id, assignedUserId: ana.id, position: 0 },
      { title: 'Diseñar dashboard', description: 'Vista inicial de tableros', status: 'DOING', listId: doing.id, assignedUserId: luis.id, position: 0 }
    ]
  });
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
