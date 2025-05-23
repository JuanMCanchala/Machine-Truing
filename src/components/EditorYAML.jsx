import CodeEditor from "@uiw/react-textarea-code-editor";
import { useState, useEffect } from "react";
import React from 'react'

export default function EditorYAML({ code, setCode }) {
  return (
    <div style={{ padding: '1rem' }}>
      <h2>Editor YAML</h2>
      <div style={{ maxHeight: 400, overflowY: 'auto', borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
        <CodeEditor
          value={code}
          language="yaml"
          placeholder="Escribe tu máquina aquí..."
          onChange={(e) => setCode(e.target.value)}
          style={{
            fontSize: 14,
            backgroundColor: "#f5f5f5",
            fontFamily: "monospace",
            minHeight: "400px",
            border: 'none',
            outline: 'none',
            resize: 'none',
          }}
        />
      </div>
    </div>
  );
}
