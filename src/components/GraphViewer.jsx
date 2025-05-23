import { useEffect, useRef, useState } from "react";
import React from 'react'

export default function GraphViewer({ dotCode, estadoActual }) {
  const ref = useRef(null);
  const containerRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [drag, setDrag] = useState({ x: 0, y: 0, startX: 0, startY: 0, dragging: false });

  useEffect(() => {
    let isMounted = true;

    import("@hpcc-js/wasm").then(async (module) => {
      const { Graphviz } = module;
      const graphviz = await Graphviz.load();

      if (ref.current && isMounted) {
        ref.current.innerHTML = "";

        let dotWithHighlight = dotCode;
        if (estadoActual) {
          const highlight = `${estadoActual} [fillcolor="#ffff66", style=filled, penwidth=3];`;
          dotWithHighlight = dotCode.replace(/\}$/, `  ${highlight}\n}`);
        }

        const svg = await graphviz.layout(dotWithHighlight, "svg", "dot");
        ref.current.innerHTML = svg;
      }
    });

    return () => {
      isMounted = false;
    };
  }, [dotCode, estadoActual]);

  const handleWheel = (e) => {
    e.preventDefault();
    let newZoom = zoom - e.deltaY * 0.001;
    newZoom = Math.max(0.2, Math.min(3, newZoom));
    setZoom(newZoom);
  };

  const handleMouseDown = (e) => {
    setDrag({ ...drag, dragging: true, startX: e.clientX - drag.x, startY: e.clientY - drag.y });
  };
  const handleMouseMove = (e) => {
    if (!drag.dragging) return;
    setDrag({ ...drag, x: e.clientX - drag.startX, y: e.clientY - drag.startY });
  };
  const handleMouseUp = () => {
    setDrag({ ...drag, dragging: false });
  };

  useEffect(() => {
    if (!containerRef.current) return;
    const c = containerRef.current;
    c.addEventListener('wheel', handleWheel, { passive: false });
    c.addEventListener('mousemove', handleMouseMove);
    c.addEventListener('mouseup', handleMouseUp);
    c.addEventListener('mouseleave', handleMouseUp);
    return () => {
      c.removeEventListener('wheel', handleWheel);
      c.removeEventListener('mousemove', handleMouseMove);
      c.removeEventListener('mouseup', handleMouseUp);
      c.removeEventListener('mouseleave', handleMouseUp);
    };
  }, [zoom, drag]);

  return (
    <div className="graph-viewer-container">
      <div className="graph-viewer-title">Visualización</div>
      <div
        className="graph-viewer-zoom"
        ref={containerRef}
        onMouseDown={handleMouseDown}
        style={{ userSelect: 'none' }}
      >
        <div
          ref={ref}
          style={{
            transform: `translate(${drag.x}px, ${drag.y}px) scale(${zoom})`,
            transformOrigin: '0 0',
            transition: drag.dragging ? 'none' : 'transform 0.1s',
            width: 'fit-content',
            height: 'fit-content',
            margin: 0,
            pointerEvents: 'auto',
          }}
        />
      </div>
    </div>
  );
}
