
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';

export default function LoginPage() {
    const router = useRouter();
    const { status } = useSession();

   useEffect(() => {
  if (status === 'authenticated') {
    router.push('/');
  }
}, [status, router]);

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
       
        <div suppressHydrationWarning style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h1>Login</h1>
            
            {error && <p style={{ color: 'red', border: '1px solid red', padding: '10px' }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="email">Email:</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <label htmlFor="password">Senha:</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>
                <button 
                    type="submit" 
                    disabled={isLoading}
                    style={{ padding: '10px 15px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    {isLoading ? 'Entrando...' : 'Entrar'}
                </button>
            </form>
            <p style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
                Usuário de Teste: {email} / Senha: {password}
            </p>
        </div>
    );
}