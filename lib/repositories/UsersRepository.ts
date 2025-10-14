import { User } from "@/types";
import db, { DatabaseType } from "../Database";

export class UsersRepository {
private db: DatabaseType;
    private tableName: string = 'users';

    constructor() {
        this.db = db;
    }

    
    public getUserByEmail(email: string): User | undefined {
        const stmt = this.db.prepare(`SELECT * FROM ${this.tableName} WHERE email = ?`);
        const user = stmt.get(email) as User | undefined;
        return user;
    }
    
    public createUser(user: User): { changes: number } {
        const stmt = this.db.prepare(`
            INSERT INTO ${this.tableName} (id, name, email, password) 
            VALUES (@id, @name, @email, @password)
        `);
        const result = stmt.run(user);
        return { changes: result.changes };
    }
    
}