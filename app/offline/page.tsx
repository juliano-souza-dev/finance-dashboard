export default function OfflinePage() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#111',
        color: '#fff',
        textAlign: 'center',
        padding: '2rem',
      }}
    >
      <h1>📴 Você está offline</h1>
      <p>As últimas transações carregadas estão sendo exibidas.</p>
      <small>Reconecte-se à internet para atualizar os dados.</small>
    </div>
  );
}
