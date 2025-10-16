'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';

import "../../global.css"
import styles from './login.module.css'

export default function Login() {
    const router = useRouter()
    const {status} = useSession()

    useEffect(() => {
        if(status === "authenticated") {
            router.push('/')
        }
    },[status, router])

    const [email, setEmail] = useState('user@test.com'); 
    const [password, setPassword] = useState('password123');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

 const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        const result = await signIn('credentials', {
            redirect: false, 
            email: email,
            password: password,
        });

        setIsLoading(false);

        if (result?.error) {
            setError('Falha no login. Verifique seu e-mail e senha.');
            console.error(result.error);
        } else if (result?.ok) {
            router.push('/');
        }
    };


    return (
        <section className={styles.loginArea}>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}> 
                <div>{error && <p style={{ color: 'red', border: '1px solid red', padding: '10px' }}>{error}</p>}</div>
                <div className='formGroup'>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                
                    />
                </div>
                <div className='formGroup'>
                    <label htmlFor="password">Senha</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className='formGroup'>
                    <button 
                    type="submit" 
                    disabled={isLoading}
                    className='buttonPrimary'
                >
                    {isLoading ? 'Entrando...' : 'Entrar'}
                </button>
                </div>
            </form>
        </section>
    )
    



    
}