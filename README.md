# Turing Machine Simulator

This project is a web-based Turing Machine simulator built with React. It allows users to define Turing machines in YAML format, visualize their state diagrams, and simulate their execution step by step or automatically.

## Features

- **YAML Editor:** Write or edit Turing machine definitions in YAML.
- **Graph Visualization:** View the state diagram of the Turing machine, with the current state highlighted during simulation.
- **Step-by-Step Simulation:** Execute the Turing machine one step at a time or run it automatically.
- **Tape Visualization:** See the tape and head position as the machine runs.
- **Status Log:** Follow the execution log and see when the machine accepts, rejects, or halts.

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/machine-turing.git
   cd machine-turing
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Start the development server:
   ```sh
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Usage

- Write your Turing machine in the YAML editor (see `pruebas.txt` for an example).
- Use the simulator controls to initialize, step, or run the machine.
- The graph and tape will update to reflect the current state.

## File Structure

- `src/components/EditorYAML.jsx`: YAML code editor component.
- `src/components/GraphViewer.jsx`: State diagram visualization.
- `src/components/Simulator.jsx`: Turing machine simulation logic and UI.
- `pruebas.txt`: Example Turing machine definition in YAML.

## License

MIT
