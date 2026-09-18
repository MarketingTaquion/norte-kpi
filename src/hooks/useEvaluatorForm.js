import { useMemo, useState } from 'react';
import { DEFAULT_CLIENTS } from '../data/clients.js';

export function useEvaluatorForm() {
  const [clientValue, setClientValue] = useState('');
  const [platformValues, setPlatformValues] = useState([]);
  const [categoria, setCategoria] = useState('');
  const [accion, setAccion] = useState('');
  const [indicador, setIndicador] = useState('');
  const [alcanzable, setAlcanzable] = useState('');
  const [segmento, setSegmento] = useState('');
  const [periodMode, setPeriodMode] = useState('lapso');
  const [lapsoValue, setLapsoValue] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [presupuesto, setPresupuesto] = useState('');
  const [moneda, setMoneda] = useState('ARS');
  const [cpcCpaRef, setCpcCpaRef] = useState('');
  const [cpmRef, setCpmRef] = useState('');
  const [contexto, setContexto] = useState('');

  const togglePlatform = (value) => {
    setPlatformValues((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  };

  const isValid = useMemo(() => {
    return categoria.trim().length > 0 && accion.trim().length > 0 && indicador.trim().length > 0 && segmento.trim().length > 0;
  }, [categoria, accion, indicador, segmento]);

  return {
    clients: DEFAULT_CLIENTS, clientValue, setClientValue,
    platformValues, togglePlatform,
    categoria, setCategoria,
    accion, setAccion,
    indicador, setIndicador,
    alcanzable, setAlcanzable,
    segmento, setSegmento,
    periodMode, setPeriodMode, lapsoValue, setLapsoValue, fechaInicio, setFechaInicio, fechaFin, setFechaFin,
    presupuesto, setPresupuesto, moneda, setMoneda,
    cpcCpaRef, setCpcCpaRef, cpmRef, setCpmRef,
    contexto, setContexto,
    isValid,
  };
}
