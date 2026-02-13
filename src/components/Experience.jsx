import { Suspense } from 'react'
import './Experience.css'
import { OrbitControls, OrthographicCamera } from '@react-three/drei'
import Loading from './Loading'
import PhotoCard from './PhotoCard'
import UI from '../ui/UI'

function Experience() {

  return (<>
    <group name='setup'>
      <OrthographicCamera lookAt={[0,0,0]} position={[0,0,5]}/>
      <OrbitControls makeDefault/>
      {/* <ambientLight intensity={2}/> */}
      <directionalLight position={[0, 10, 5]} intensity={1.5} />
    </group>
    <Loading/>
    <Suspense>
      <PhotoCard/>
    </Suspense>
  </>)
}

export default Experience