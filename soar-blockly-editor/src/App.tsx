import { useEffect, useRef, useState } from 'react';
import * as Blockly from 'blockly';
import 'blockly/blocks';
import { toolbox } from './toolbox';
import './index.css';
import { SoarGenerator } from './soarGenerator';

function App() {
  const blocklyDivRef = useRef<HTMLDivElement | null>(null);
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);
  const [generatedCode, setGeneratedCode] = useState<string>(
    '// Add blocks to generate Soar rules...'
  );

  useEffect(() => {
    if (!blocklyDivRef.current || workspaceRef.current) return;

    // Inject Blockly Workspace
    const workspace = Blockly.inject(blocklyDivRef.current, {
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

    workspaceRef.current = workspace;

    // Function to run code generation and update state
    const updateCode = () => {
      const soarCode = SoarGenerator.workspaceToCode(workspace);
      setGeneratedCode(
        soarCode.trim() ? soarCode : '// Add blocks to generate Soar rules...'
      );
    };

    // Real-time Event Listener: Updates generated code on block changes
    const onWorkspaceChange = (event: Blockly.Events.Abstract) => {
      // Ignore UI events (e.g. clicking, dragging canvas) to avoid redundant re-renders
      if (event.isUiEvent) return;
      updateCode();
    };

    workspace.addChangeListener(onWorkspaceChange);

    // Initial code sync
    updateCode();

    // Handle Window Resize
    const handleResize = () => {
      if (workspaceRef.current) {
        Blockly.svgResize(workspaceRef.current);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      workspace.removeChangeListener(onWorkspaceChange);
      workspace.dispose();
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