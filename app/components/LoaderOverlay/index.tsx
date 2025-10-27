'use client';
import styles from './styles.module.css';

export default function LoaderOverlay() {
  return (
    <div className={styles.overlay}>
      <div className={styles.loader}></div>
      <p>Carregando...</p>
    </div>
  );
}
