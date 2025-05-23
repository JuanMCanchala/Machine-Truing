import { useState, useRef, useEffect } from "react";
import * as yaml from "js-yaml";
import React from 'react'

export default function Simulator({ code, setStateGlobal }) {
  const [tape, setTape] = useState([]);
  const [head, setHead] = useState(0);
  const [state, setState] = useState("");
  const [log, setLog] = useState([]);
  const [finished, setFinished] = useState(false);
  const [input, setInput] = useState("aabba");
  const [auto, setAuto] = useState(false);

  const machineRef = useRef(null);
  const transitionMapRef = useRef({});
  const intervalRef = useRef(null);
  const logRef = useRef(null);

  const setupMachine = () => {
    try {
      const machine = yaml.load(code);
      machineRef.current = machine;
      const tapeArray = input.split("");
      setTape(tapeArray);
      setHead(0);
      setState(machine.start);
      setStateGlobal(machine.start);
      setLog([]);
      setFinished(false);
      setAuto(false);
      clearInterval(intervalRef.current);

      const map = {};
      for (const t of machine.transitions) {
        map[`${t.from}_${t.read}`] = t;
      }
      transitionMapRef.current = map;
    } catch (err) {
      setLog(["❌ Error de YAML: " + err.message]);
      setFinished(true);
    }
  };

  const nextStep = () => {
    if (finished) return;

    const machine = machineRef.current;
    const map = transitionMapRef.current;

    const currentSymbol = tape[head] || "_";
    const key = `${state}_${currentSymbol}`;
    const transition = map[key];
    const newLog = [...log];

    newLog.push(`Estado=${state}, Posición=${head}, Símbolo=${currentSymbol}`);

    if (!transition) {
      newLog.push("⛔ Máquina se estancó");
      setLog(newLog);
      setFinished(true);
      setAuto(false);
      clearInterval(intervalRef.current);
      return;
    }

    const newTape = [...tape];
    newTape[head] = transition.write;
    let newHead = head + (transition.move === "R" ? 1 : transition.move === "L" ? -1 : 0);
    if (newHead < 0) {
      newTape.unshift("_");
      newHead = 0;
    }
    const newState = transition.to;

    if ((machine.accept || []).includes(newState)) {
      newLog.push(`✅ Aceptado en estado ${newState}`);
      setFinished(true);
      setAuto(false);
      clearInterval(intervalRef.current);
    } else if ((machine.reject || []).includes(newState)) {
      newLog.push(`❌ Rechazado en estado ${newState}`);
      setFinished(true);
      setAuto(false);
      clearInterval(intervalRef.current);
    }

    setTape(newTape);
    setHead(newHead);
    setState(newState);
    setStateGlobal(newState);
    setLog(newLog);
  };

  const startAuto = () => {
    if (!state || finished || auto) return;
    setAuto(true);
    intervalRef.current = setInterval(() => {
      nextStep();
    }, 1000);
  };

  const stopAuto = () => {
    setAuto(false);
    clearInterval(intervalRef.current);
  };

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [log]);

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div className="p-4" style={{ overflow: 'hidden', flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, height: '100%' }}>
      <h2 className="text-lg font-bold mb-2">Simulador paso a paso (automático)</h2>
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Cinta inicial:</label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={!finished && state}
          className="border border-gray-300 rounded px-2 py-1 font-mono disabled:bg-gray-100"
        />
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={setupMachine}
          disabled={!finished && state}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Reiniciar
        </button>
        <button
          onClick={nextStep}
          disabled={finished || !state || auto}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Siguiente paso
        </button>
        <button
          onClick={startAuto}
          disabled={finished || auto || !state}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Iniciar animación
        </button>
        <button
          onClick={stopAuto}
          disabled={!auto}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Detener
        </button>
      </div>
      <div className="mt-4" style={{ display: 'flex', gap: '2.5rem', alignItems: 'flex-start', justifyContent: 'flex-start', flex: 'unset', minHeight: 0, height: 'auto', marginTop: '1rem'}}>
        <div style={{ flex: 1, minWidth: 0, overflow: 'visible', marginTop: '-20px'}}>
          <h3 className="font-semibold mb-2">Cinta</h3>
          <div style={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: '0.5rem',
            overflowX: 'auto',
            marginBottom: '1.5rem',
            marginLeft: '2.5rem',
            padding: '1.2rem 1.5rem',
            background: '#fff',
            borderRadius: 14,
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            border: '2px solid #e2e8f0',
            minHeight: 70,
            maxWidth: '100%',
            whiteSpace: 'nowrap',
            overflowY: 'visible',
            height: 'auto',
            flex: 'unset',
          }}>
            {tape.map((symbol, idx) => (
              <div
                key={idx}
                style={{
                  border: idx === head ? '3px solid #facc15' : '2px solid #cbd5e1',
                  background: idx === head ? '#fef08a' : '#f8fafc',
                  color: '#222',
                  fontWeight: idx === head ? 700 : 500,
                  fontSize: 32,
                  width: 48,
                  height: 48,
                  borderRadius: 8,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: idx === head ? '0 2px 8px #fde04780' : '0 1px 4px #cbd5e180',
                  transition: 'all 0.15s',
                  fontFamily: 'monospace',
                }}
              >
                {symbol}
              </div>
            ))}
          </div>
        </div>
        <div style={{ width: 400, maxHeight: 340, overflowY: 'auto', background: '#f8fafc', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', padding: '0.75rem 1.25rem', marginLeft: '3rem', marginRight: 'auto', border: '1.5px solid #e2e8f0', marginTop: -100, height: '240px' }}>
          <div className="font-semibold mb-2" style={{ fontSize: 20, color: '#334155', marginTop: 0, marginBottom: 8 }}>Estados</div>
          <div style={{ fontSize: 18, lineHeight: 1.7, color: '#222', fontFamily: 'monospace', fontWeight: 500 }}>
            {log.map((line, index) => (
              <div key={index}>{line}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
