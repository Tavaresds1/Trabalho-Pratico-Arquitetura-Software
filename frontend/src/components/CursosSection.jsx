import { useState, useEffect, useCallback } from 'react';
import { getCursos, createCurso } from '../services/cursosService';
import Alert from './Alert';

const EMPTY_FORM = { nome: '', carga_horaria: '', departamento: '' };

const toAlert = (err) => ({
  type: err.status === 503 ? 'service-unavailable' : 'error',
  message: err.message,
  errors: err.errors,
});

export default function CursosSection() {
  const [cursos, setCursos]       = useState([]);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [alert, setAlert]         = useState(null);
  const [loading, setLoading]     = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchCursos = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getCursos();
      setCursos(result.data);
    } catch (err) {
      setAlert(toAlert(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCursos(); }, [fetchCursos]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setAlert(null);
    try {
      await createCurso({ ...form, carga_horaria: Number(form.carga_horaria) });
      setForm(EMPTY_FORM);
      setAlert({ type: 'success', message: 'Curso cadastrado com sucesso!' });
      fetchCursos();
    } catch (err) {
      setAlert(toAlert(err));
    } finally {
      setSubmitting(false);
    }
  };

  const fmt = (iso) => new Date(iso).toLocaleDateString('pt-BR');

  return (
    <div className="section">
      {alert && <Alert alert={alert} onClose={() => setAlert(null)} />}

      {/* ── Formulario ── */}
      <div className="card">
        <div className="card__title">
          <h2>Cadastrar Curso</h2>
        </div>
        <form className="form" onSubmit={handleSubmit}>
          <div className="form__row">
            <div className="form__group">
              <label htmlFor="c-nome">Nome do curso</label>
              <input
                id="c-nome" name="nome" value={form.nome}
                onChange={handleChange} placeholder="Ex: Ciencia da Computacao" required
              />
            </div>
            <div className="form__group">
              <label htmlFor="c-carga">Carga horaria (h)</label>
              <input
                id="c-carga" type="number" name="carga_horaria" value={form.carga_horaria}
                onChange={handleChange} placeholder="Ex: 3200" min={1} required
              />
            </div>
          </div>
          <div className="form__group">
            <label htmlFor="c-depto">Departamento</label>
            <input
              id="c-depto" name="departamento" value={form.departamento}
              onChange={handleChange} placeholder="Ex: Engenharia de Software" required
            />
          </div>
          <button type="submit" className="btn btn--primary" disabled={submitting}>
            {submitting ? 'Cadastrando...' : 'Cadastrar Curso'}
          </button>
        </form>
      </div>

      {/* ── Listagem ── */}
      <div className="card">
        <div className="card__title">
          <h2>Cursos Cadastrados</h2>
          <button className="btn btn--secondary" onClick={fetchCursos} disabled={loading}>
            {loading ? 'Atualizando...' : 'Atualizar'}
          </button>
        </div>
        <div className="table__wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Nome</th>
                <th>Carga Horaria</th>
                <th>Departamento</th>
                <th>Cadastrado em</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="table__loading">Carregando...</td></tr>
              ) : cursos.length === 0 ? (
                <tr><td colSpan={5} className="table__empty">Nenhum curso cadastrado ainda.</td></tr>
              ) : (
                cursos.map((c) => (
                  <tr key={c.id}>
                    <td className="table__id">{c.id}</td>
                    <td>{c.nome}</td>
                    <td><span className="badge">{c.carga_horaria}h</span></td>
                    <td>{c.departamento}</td>
                    <td>{fmt(c.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
