import { PrismaClient } from '@prisma/client';
import { encodePassword } from '../utils';
import { join } from 'path';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      email: process.env.AUTH_SERVICE_ROOT_EMAIL ?? 'root@root.com',
      name: process.env.AUTH_SERVICE_ROOT_NAME ?? 'root',
      password: encodePassword(
        process.env.AUTH_SERVICE_ROOT_PASSWORD ?? 'root',
      ),
      role: 'ADMIN',
    },
  });

  console.log(
    'New user created:',
    Object.entries(user)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n'),
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
