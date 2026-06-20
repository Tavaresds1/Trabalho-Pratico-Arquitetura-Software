const TYPES = {
  'service-unavailable': {
    label: 'Servico Indisponivel (503)',
    className: 'alert--unavailable',
  },
  error: {
    label: 'Erro',
    className: 'alert--error',
  },
  success: {
    label: 'Sucesso',
    className: 'alert--success',
  },
};

export default function Alert({ alert, onClose }) {
  const config = TYPES[alert.type] ?? TYPES.error;

  return (
    <div className={`alert ${config.className}`} role="alert">
      <div className="alert__content">
        <span className="alert__label">{config.label}</span>
        <span className="alert__message">{alert.message}</span>
        {alert.errors && alert.errors.length > 0 && (
          <ul className="alert__errors">
            {alert.errors.map((e, i) => (
              <li key={i}>
                <strong>{e.field}</strong>: {e.message}
              </li>
            ))}
          </ul>
        )}
      </div>
      <button className="alert__close" onClick={onClose} aria-label="Fechar">
        &times;
      </button>
    </div>
  );
}
