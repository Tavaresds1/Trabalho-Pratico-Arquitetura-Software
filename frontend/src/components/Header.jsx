export default function Header() {
  return (
    <header className="header">
      <div className="header__brand">
        <div className="header__monogram">SA</div>
        <div>
          <div className="header__title">Sistema Academico</div>
          <div className="header__subtitle">Arquitetura de Microsservicos — Node.js + PostgreSQL</div>
        </div>
      </div>
      <span className="header__badge">API Gateway :3000</span>
    </header>
  );
}
