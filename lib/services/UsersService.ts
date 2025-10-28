import  bcrypt  from 'bcrypt'

import { User } from '@/types'; 
import { UsersRepository } from '../repositories/UsersRepository';


type UserWithoutPassword = Omit<User, 'password'>; 

export class UsersService {
    private usersRepository: UsersRepository;

    constructor() {
        this.usersRepository = new UsersRepository();
    }

    
    public async validateCredentials(email: string, password: string): Promise<UserWithoutPassword | null> {
        const user = this.usersRepository.getUserByEmail(email);

        if (!user) {
            
            return null;
        }

  
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        }

        
        return null;
    }
}