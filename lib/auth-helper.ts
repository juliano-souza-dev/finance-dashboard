import { getServerSession } from 'next-auth'

interface UserSession {
   user: {
     id: string;
    name: string;
    email: string
   },
   expires: string
}

export async function getAuthenticatedUser(): Promise<UserSession> {
    const session = await getServerSession() as UserSession | null

    if(!session || !session.user) {
        const error = new Error("Não autorizado!")
       throw error;
    }

    return session;
}