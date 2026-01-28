import { Suspense } from 'react'
import './Experience.css'
import { OrbitControls, OrthographicCamera } from '@react-three/drei'
import Loading from './Loading'
import PhotoCard from './PhotoCard'

function Experience() {

  return (<>
    <group name='setup'>
      <OrthographicCamera lookAt={[0,0,0]} position={[0,0,5]}/>
      <OrbitControls makeDefault enableZoom={false} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 2}/>
    </group>
    <Loading/>
    <Suspense>
      <PhotoCard/>
    </Suspense>
  </>)
}

export default Experience