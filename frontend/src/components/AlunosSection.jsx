import { useState, useEffect, useCallback } from 'react';
import { getAlunos, createAluno } from '../services/alunosService';
import Alert from './Alert';

const EMPTY_FORM = { nome: '', matricula: '', email: '' };

const toAlert = (err) => ({
  type: err.status === 503 ? 'service-unavailable' : 'error',
  message: err.message,
  errors: err.errors,
});

export default function AlunosSection() {
  const [alunos, setAlunos]       = useState([]);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [alert, setAlert]         = useState(null);
  const [loading, setLoading]     = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchAlunos = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getAlunos();
      setAlunos(result.data);
    } catch (err) {
      setAlert(toAlert(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAlunos(); }, [fetchAlunos]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setAlert(null);
    try {
      await createAluno(form);
      setForm(EMPTY_FORM);
      setAlert({ type: 'success', message: 'Aluno cadastrado com sucesso!' });
      fetchAlunos();
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
          <h2>Cadastrar Aluno</h2>
        </div>
        <form className="form" onSubmit={handleSubmit}>
          <div className="form__row">
            <div className="form__group">
              <label htmlFor="a-nome">Nome completo</label>
              <input
                id="a-nome" name="nome" value={form.nome}
                onChange={handleChange} placeholder="Ex: Maria da Silva" required
              />
            </div>
            <div className="form__group">
              <label htmlFor="a-matricula">Matricula</label>
              <input
                id="a-matricula" name="matricula" value={form.matricula}
                onChange={handleChange} placeholder="Ex: 2024001" required
              />
            </div>
          </div>
          <div className="form__group">
            <label htmlFor="a-email">E-mail institucional</label>
            <input
              id="a-email" type="email" name="email" value={form.email}
              onChange={handleChange} placeholder="Ex: maria.silva@uni.edu.br" required
            />
          </div>
          <button type="submit" className="btn btn--primary" disabled={submitting}>
            {submitting ? 'Cadastrando...' : 'Cadastrar Aluno'}
          </button>
        </form>
      </div>

      {/* ── Listagem ── */}
      <div className="card">
        <div className="card__title">
          <h2>Alunos Cadastrados</h2>
          <button className="btn btn--secondary" onClick={fetchAlunos} disabled={loading}>
            {loading ? 'Atualizando...' : 'Atualizar'}
          </button>
        </div>
        <div className="table__wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Nome</th>
                <th>Matricula</th>
                <th>E-mail</th>
                <th>Cadastrado em</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="table__loading">Carregando...</td></tr>
              ) : alunos.length === 0 ? (
                <tr><td colSpan={5} className="table__empty">Nenhum aluno cadastrado ainda.</td></tr>
              ) : (
                alunos.map((a) => (
                  <tr key={a.id}>
                    <td className="table__id">{a.id}</td>
                    <td>{a.nome}</td>
                    <td><span className="badge">{a.matricula}</span></td>
                    <td>{a.email}</td>
                    <td>{fmt(a.createdAt)}</td>
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
