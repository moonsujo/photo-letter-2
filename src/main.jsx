import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Experience from './components/Experience.jsx'
import { Canvas } from '@react-three/fiber'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Canvas
      shadows
    >
      <Experience/>
    </Canvas>
  </StrictMode>,
)
