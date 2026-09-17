import { useMemo, useState } from 'react';
import { DEFAULT_CLIENTS } from '../data/clients.js';

const MAX_PEDIDOS = 6;

export function useSetterForm() {
  const [clients, setClients] = useState(DEFAULT_CLIENTS);
  const [clientValue, setClientValue] = useState('');
  const [stageValues, setStageValues] = useState([]);
  const [periodMode, setPeriodMode] = useState('lapso');
  const [lapsoValue, setLapsoValue] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [presupuesto, setPresupuesto] = useState('');
  const [moneda, setMoneda] = useState('ARS');
  const [platformValues, setPlatformValues] = useState([]);
  const [pedidos, setPedidos] = useState(['']);
  const [nsm, setNsm] = useState('');

  const addClient = (label) => {
    const value = `custom-${Date.now()}`;
    setClients((prev) => [...prev, { value, label, description: 'Agregado en sesión' }]);
    setClientValue(value);
  };

  const toggleStage = (value) => {
    setStageValues((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  };

  const togglePlatform = (value) => {
    setPlatformValues((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  };

  const updatePedido = (index, text) => {
    setPedidos((prev) => prev.map((p, i) => (i === index ? text : p)));
  };

  const addPedido = () => {
    setPedidos((prev) => (prev.length < MAX_PEDIDOS ? [...prev, ''] : prev));
  };

  const removePedido = (index) => {
    setPedidos((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));
  };

  const isValid = useMemo(() => {
    const hasClient = Boolean(clientValue);
    const hasPedido = pedidos.some((p) => p.trim().length > 0);
    return hasClient && hasPedido;
  }, [clientValue, pedidos]);

  const resetForm = () => {
    setClientValue('');
    setStageValues([]);
    setPeriodMode('lapso');
    setLapsoValue('');
    setFechaInicio('');
    setFechaFin('');
    setPresupuesto('');
    setMoneda('ARS');
    setPlatformValues([]);
    setPedidos(['']);
    setNsm('');
  };

  return {
    clients, clientValue, setClientValue, addClient,
    stageValues, toggleStage,
    periodMode, setPeriodMode, lapsoValue, setLapsoValue, fechaInicio, setFechaInicio, fechaFin, setFechaFin,
    presupuesto, setPresupuesto, moneda, setMoneda,
    platformValues, togglePlatform,
    pedidos, updatePedido, addPedido, removePedido, maxPedidos: MAX_PEDIDOS,
    nsm, setNsm,
    isValid,
    resetForm,
  };
}
