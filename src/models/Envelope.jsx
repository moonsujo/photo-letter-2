
import React, { useEffect, useRef } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { LoopOnce, DoubleSide } from 'three'

export function Envelope(props) {
  const group = useRef()
  const { nodes, animations } = useGLTF('/models/envelope.glb')
  const { actions, names } = useAnimations(animations, group)

  // materials

  useEffect(() => {
    // Iterate through all animation names and play them
    names.forEach((name) => {
        const action = actions[name];
        if (action) {
          action.reset().setLoop(LoopOnce)
          action.clampWhenFinished = true;

          if (props.open === undefined) {
            // don't play animation
          } else if (props.open) {
            // play forward
            action.timeScale = 1
            action.play()
          } else {
            // play reverse
            action.timeScale = -1
            // start from the end
            action.time = action.getClip().duration
            action.play()
          }
        }
    });
  }, [actions, names, props.open])

  const envelopeColor = '#ccff00'
  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <mesh
          name="Plane"
          castShadow
          receiveShadow
          geometry={nodes.Plane.geometry}
          scale={[1.234, 1, 1]}
        >
          <meshStandardMaterial color={envelopeColor} side={DoubleSide}/>
        </mesh>
        <group name="Empty001" rotation={[3, -Math.PI / 2, 0]}>
          <mesh
            name="Plane001"
            castShadow
            receiveShadow
            geometry={nodes.Plane001.geometry}
            rotation={[1.571, 1.436, -1.571]}
            scale={[1.234, 1, 1]}
          >
            <meshStandardMaterial color={envelopeColor} side={DoubleSide}/>
          </mesh>
        </group>
      </group>
    </group>
  )
}