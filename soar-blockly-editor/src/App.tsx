import { useEffect, useRef, useState } from 'react';
import * as Blockly from 'blockly';
import 'blockly/blocks';
import { toolbox } from './toolbox';
import './index.css';

function App() {
  const blocklyDivRef = useRef<HTMLDivElement | null>(null);
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);
  const [generatedCode, setGeneratedCode] = useState<string>('// Code generated from blocks will appear here...');

  useEffect(() => {
    if (!blocklyDivRef.current || workspaceRef.current) return;

    workspaceRef.current = Blockly.inject(blocklyDivRef.current, {
      toolbox,
      toolboxPosition: 'start',
      collapse: true,
      comments: true,
      trashcan: true,
      zoom: {
        controls: true,
        wheel: true,
        startScale: 1.0,
        maxScale: 3,
        minScale: 0.3,
        scaleSpeed: 1.2,
      },
    });

    const handleResize = () => {
      if (workspaceRef.current) {
        Blockly.svgResize(workspaceRef.current);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      workspaceRef.current?.dispose();
      workspaceRef.current = null;
    };
  }, []);

  const handleClear = () => {
    if (workspaceRef.current) {
      workspaceRef.current.clear();
      setGeneratedCode('// Workspace cleared');
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="brand">
          <span className="brand-badge">FIT</span>
          <h1>SoarBlocks</h1>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={handleClear}>
            Clear Workspace
          </button>
          <button className="btn btn-primary">
            Run Code
          </button>
        </div>
      </header>

      <main className="main-content">
        <div id="blocklyDiv" ref={blocklyDivRef} className="blockly-container" />
        
        <aside className="output-pane">
          <div className="pane-section">
            <div className="pane-header">Generated Code</div>
            <pre id="generatedCode"><code>{generatedCode}</code></pre>
          </div>
          
          <div className="pane-section">
            <div className="pane-header">Console Output</div>
            <div id="output" className="output-console">
              <span className="console-placeholder">Program output will stream here...</span>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

export default App;