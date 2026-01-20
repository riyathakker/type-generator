import { useEffect, useState } from "react";
import { jsonToTs, type OutputStyle } from "./convertJson";
import "./App.css";
import { sampleJSON } from "./constant";
import { toast, Toaster } from "sonner";

function App() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [interfaceName, setInterfaceName] = useState("Test");
  const [outputStyle, setOutputStyle] = useState<OutputStyle>("interface");

  const handleGenerate = () => {
    if (!input.trim()) {
      setOutput("");
      return;
    }

    try {
      const parsedInput = JSON.parse(input);
      const output = jsonToTs(interfaceName, parsedInput, outputStyle);
      setOutput(output);
    } catch (err) {
      setOutput(`Invalid JSON — ${String(err)}`);
    }
  };

  const handleCopy = async () => {
    if (!output.trim()) return;

    try {
      await navigator.clipboard.writeText(output);
      toast.success("Output Copied to Clipboard!");
    } catch {
      toast.error("Clipboard copy failed");
    }
  };

  const handleSampleInsert = () => {
    setInput(sampleJSON);
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
  };

  useEffect(() => {
    handleGenerate();
  }, [outputStyle]);

  return (
    <>
      <Toaster richColors closeButton />
      <div className="Card">
        <h1>TypeScript Interface/Type Generator</h1>

        <div className="Buttons">
          <label>
            Output style
            <select
              value={outputStyle}
              onChange={(e) => setOutputStyle(e.target.value as OutputStyle)}
              id="OutputStyle"
            >
              <option value="interface">Interface</option>
              <option value="type">Type</option>
            </select>
          </label>

          <input
            value={interfaceName}
            onChange={(e) => setInterfaceName(e.target.value)}
            onBlur={(e) => {
              const value = e.target.value;
              if (value === "") {
                setInterfaceName("Test");
              }
            }}
            placeholder="Type Name"
            id="InterfaceName"
          />

          <div className="Actions">
            <button onClick={handleGenerate}>Generate</button>
            <button onClick={handleCopy}>Copy</button>
            <button onClick={handleSampleInsert}>Insert sample JSON</button>
            <button onClick={handleClear}>Clear</button>
          </div>
        </div>

        <div className="Input-Output">
          <div className="Field">
            <h3>JSON Input</h3>

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste Your JSON here"
            />
          </div>

          <div className="Field">
            <h3>Generated TypeScript Output</h3>
            <div className="Output">{output}</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
