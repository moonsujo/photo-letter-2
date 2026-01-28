import { Suspense, useState } from 'react'
import './Experience.css'
import { OrbitControls, OrthographicCamera } from '@react-three/drei'
import { Dedication } from './Dedication'
import TestComponent from './TestComponent'
import Loading from './Loading'

function Experience() {

  return (<>
    <group name='setup'>
      <OrthographicCamera lookAt={[0,0,0]} position={[0,0,5]}/>
      <OrbitControls makeDefault enableZoom={false} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 2}/>
    </group>
    <Loading/>
    <Suspense>
      {/* <Dedication/> */}
    </Suspense>
  </>)
}

export default Experience