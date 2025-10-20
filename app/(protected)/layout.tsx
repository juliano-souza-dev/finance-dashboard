'use client'
import '../../app/global.css'
import styles from './layout.module.css'
import NextAuthSessionProvider from "@/providers";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>
        <NextAuthSessionProvider>
          {children}
        </NextAuthSessionProvider>
          <div className={styles.bottomNav}>
                
                {/* Item Dashboard */}
                <a href="/dashboard" className={`${styles.navItem} ${styles.navItemActive}`}>
                    <span className={styles.navIcon}>
                        ☰
                    </span>
                    Dashboard
                </a>
                
                {/* Item Novo Registro */}
                <a href="/novo-registro" className={styles.navItem}>
                    <span className={styles.navIcon}>
                        📝
                    </span>
                    Novo Registro
                </a>
                
                {/* Item Entradas */}
                <a href="/entradas" className={styles.navItem}>
                    <span className={styles.navIcon}>
                        ⬆️
                    </span>
                    Entradas
                </a>
                
                {/* Item Saídas (Se você tiver) */}
                {/* <a href="/saidas" className={styles.navItem}>
                    <span className={styles.navIcon}>
                        ⬇️
                    </span>
                    Saídas
                </a> */}
            </div>
      </body> 
    </html>
  );
}