import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";
import { Experience } from "./components/Experience";
import { UI } from "./components/UI";

function App() {
  return (
    <>
      <Leva hidden/>
      <div className="absolute top-0 left-0 right-0 bottom-0 z-10">
        <UI />
      </div>
      <Loader />
      <Canvas shadows camera={{ position: [0, 0, 0], fov: 30 }}>
        <Experience />
      </Canvas>
    </>
  );
}

export default App;
