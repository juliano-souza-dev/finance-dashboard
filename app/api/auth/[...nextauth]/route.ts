import { UsersRepository } from "@/lib/repositories/UsersRepository";
import { UsersService } from "@/lib/services/UsersService";
import NextAuth, { AuthOptions } from "next-auth";
import {User} from '../../../../types/'
import  CredentialsProvider  from "next-auth/providers/credentials";
import { env } from "@/env";



const userService: UsersService = new UsersService()

export const authOptions: AuthOptions = {
    providers: [
       CredentialsProvider({
        name: "Credentials",
        credentials: {
            email: {label: "Email", type: "text"},
            password: {label: "Password", type:"password"}
        },
        async authorize(credentials) {
            if(!credentials?.email || !credentials.password) return null;

            const user:Omit<User, 'password'> | null = await userService.validateCredentials(credentials.email, credentials.password)
            if(!user) {
                return null;
            }

          
            return {
                id: user.id,
                name: user.name,
                email: user.email,
            }
        }
       })
    ],
    session: {
        strategy: "jwt"
    },
    pages: {
        signIn: "/login"
    },
    secret: env.NEXTAUTH_SECRET
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST}