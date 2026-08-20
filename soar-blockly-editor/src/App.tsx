import { useEffect, useRef } from 'react'
import * as Blockly from 'blockly';
import 'blockly/blocks';
import { toolbox } from './toolbox';
import './App.css'

function App() {
  const blocklyDivRef = useRef<HTMLDivElement | null>(null)
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null)

  useEffect(() => {
    if (!blocklyDivRef.current || workspaceRef.current) {
      return
    }

    workspaceRef.current = Blockly.inject(blocklyDivRef.current, {
      toolbox,
      toolboxPosition: 'start',
      collapse: true,
      comments: true,
      trashcan: true,
    })

    return () => {
      workspaceRef.current?.dispose()
      workspaceRef.current = null
    }
  }, [])

  return (
    <div id="pageContainer">
      <div id="outputPane">
        <pre id="generatedCode"><code></code></pre>
        <div id="output"></div>
      </div>
      <div id="blocklyDiv" ref={blocklyDivRef} />
    </div>
  )
}

export default App
