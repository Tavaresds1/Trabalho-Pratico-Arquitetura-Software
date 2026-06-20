import { useState } from 'react';
import Header from './components/Header';
import AlunosSection from './components/AlunosSection';
import CursosSection from './components/CursosSection';

const TABS = [
  { key: 'alunos', label: 'Alunos' },
  { key: 'cursos', label: 'Cursos' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('alunos');

  return (
    <div className="app">
      <Header />
      <main className="main">
        <nav className="tabs" aria-label="Secoes">
          {TABS.map((t) => (
            <button
              key={t.key}
              className={`tab${activeTab === t.key ? ' tab--active' : ''}`}
              onClick={() => setActiveTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </nav>

        {activeTab === 'alunos' ? <AlunosSection /> : <CursosSection />}
      </main>
    </div>
  );
}
