import { db } from '@/lib/db';
import getSession from './getSession'

const getUsers = async () => {
  const session = await getSession();

  if(!session?.user?.email) return [];
  
  try {
    const users = await db.user.findMany({
        where: {
            NOT: {
                email: session.user.email, // Don't include the current user in the list
            }
        },
        orderBy: {
            createdAt: 'desc',
        }
    });

    return users;
  } catch {
    return [];
  }
}

export default getUsers