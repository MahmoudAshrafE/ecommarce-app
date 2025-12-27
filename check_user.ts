
import { prisma } from './src/lib/prisma';

async function main() {
    try {
        const user = await prisma.user.findUnique({
            where: { email: 'mamo056999@gmail.com' }
        });
        console.log('User found:', user ? 'YES' : 'NO');
        if (user) console.log(user);
    } catch (e) {
        console.error(e);
    }
}
main();
