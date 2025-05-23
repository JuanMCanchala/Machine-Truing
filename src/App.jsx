import React, { useState, useEffect } from "react";
import EditorYAML from "./components/EditorYAML";
import GraphViewer from "./components/GraphViewer";
import Simulator from "./components/Simulator";
import Split from "react-split";
import * as yaml from "js-yaml";
import "./App.css"; // <--- IMPORTANTE


function App() {
  const [currentState, setCurrentState] = useState("");
  const [code, setCode] = useState(`# Ejemplo simple
start: q0
accept: [q_accept]
reject: [q_reject]
transitions:
  - from: q0
    read: a
    to: q1
    write: a
    move: R
  - from: q1
    read: _
    to: q_accept
    write: _
    move: S
`);
  const [dot, setDot] = useState("");

  useEffect(() => {
    try {
      const parsed = yaml.load(code);
      const states = new Set();
      let dotCode = "digraph G {\n  rankdir=LR;\n  node [style=filled, fillcolor=white];\n";
      dotCode += `  "" -> ${parsed.start};\n`;

      parsed.transitions.forEach((t) => {
        states.add(t.from);
        states.add(t.to);
        const label = `${t.read}→${t.write},${t.move}`;
        dotCode += `  ${t.from} -> ${t.to} [label="${label}"];\n`;
      });

      states.forEach((state) => {
        if (parsed.accept.includes(state)) {
          dotCode += `  ${state} [shape=doublecircle];\n`;
        } else if ((parsed.reject || []).includes(state)) {
          dotCode += `  ${state} [shape=circle color=red];\n`;
        } else {
          dotCode += `  ${state} [shape=circle];\n`;
        }
      });

      dotCode += "}";
      setDot(dotCode);
    } catch (err) {
      console.error("Error de YAML", err);
      setDot('digraph G { error [label="YAML inválido"] }');
    }
  }, [code]);

  return (
    <>
      <Split className="split" sizes={[50, 50]} minSize={300} gutterSize={8}>
        <div>
          <GraphViewer dotCode={dot} estadoActual={currentState} />
        </div>
        <div>
          <EditorYAML code={code} setCode={setCode} />
        </div>
      </Split>
      <div className="simulador">
        <Simulator code={code} setStateGlobal={setCurrentState} />
      </div>
    </>
  );
}

export default App;
