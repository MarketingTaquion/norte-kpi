import { useMemo, useState } from 'react';
import { DEFAULT_CLIENTS } from '../data/clients.js';

const MAX_PEDIDOS = 6;
const EMPTY_PEDIDO = { texto: '', categoria: '' };

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
  const [pedidos, setPedidos] = useState([{ ...EMPTY_PEDIDO }]);
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

  const updatePedidoTexto = (index, texto) => {
    setPedidos((prev) => prev.map((p, i) => (i === index ? { ...p, texto } : p)));
  };

  const updatePedidoCategoria = (index, categoria) => {
    setPedidos((prev) => prev.map((p, i) => (i === index ? { ...p, categoria } : p)));
  };

  const addPedido = () => {
    setPedidos((prev) => (prev.length < MAX_PEDIDOS ? [...prev, { ...EMPTY_PEDIDO }] : prev));
  };

  const removePedido = (index) => {
    setPedidos((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));
  };

  // Cada pedido con texto tiene que traer su métrica — no se puede avanzar
  // con un pedido a medio completar.
  const pedidosConTexto = pedidos.filter((p) => p.texto.trim().length > 0);
  const pedidosIncompletos = pedidosConTexto.some((p) => !p.categoria);

  const isValid = useMemo(() => {
    const hasClient = Boolean(clientValue);
    return hasClient && pedidosConTexto.length > 0 && !pedidosIncompletos;
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    setPedidos([{ ...EMPTY_PEDIDO }]);
    setNsm('');
  };

  return {
    clients, clientValue, setClientValue, addClient,
    stageValues, toggleStage,
    periodMode, setPeriodMode, lapsoValue, setLapsoValue, fechaInicio, setFechaInicio, fechaFin, setFechaFin,
    presupuesto, setPresupuesto, moneda, setMoneda,
    platformValues, togglePlatform,
    pedidos, updatePedidoTexto, updatePedidoCategoria, addPedido, removePedido, maxPedidos: MAX_PEDIDOS,
    pedidosIncompletos,
    nsm, setNsm,
    isValid,
    resetForm,
  };
}
