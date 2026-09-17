import { useState } from 'react';
import Header from './components/Header.jsx';
import TabNav from './components/TabNav.jsx';
import SetterTab from './components/setter/SetterTab.jsx';
import EvaluatorTab from './components/evaluator/EvaluatorTab.jsx';

const TABS = [
  { value: 'setter', label: '01 · Seteador de KPIs' },
  { value: 'evaluator', label: '02 · Evaluador de KPIs' },
];

export default function App() {
  const [tab, setTab] = useState('setter');

  return (
    <div className="app-shell">
      <Header />
      <TabNav tabs={TABS} active={tab} onChange={setTab} />
      {tab === 'setter' ? <SetterTab /> : <EvaluatorTab />}
    </div>
  );
}
