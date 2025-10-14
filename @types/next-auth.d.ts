// src/types/next-auth.d.ts

import 'next-auth';
import { JWT } from 'next-auth/jwt';

// 1. Estender o Objeto User (o que o CredentialsProvider retorna)
declare module 'next-auth' {
    interface User {
        id: string; 
        name?: string;
        email?: string
    }

    // 2. Estender o Objeto Session (o que o frontend vê)
    interface Session {
        user: {
            id: string; // Adicionamos 'id' ao user da Session
            email: string;
            name?: string | null;
        };
    }
}

// 3. Estender o Token JWT (o que está nos cookies)
declare module 'next-auth/jwt' {
    interface JWT {
        id: string;
    }
}