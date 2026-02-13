import { useEffect, useCallback, useRef, useState } from "react";
import { useDirection } from "../stores/useDirection";
import { Dedication } from "./Dedication";
import { useGLTF, useAnimations, shaderMaterial } from '@react-three/drei'
import { LoopOnce, DoubleSide } from 'three'

import { useSpring, animated } from "@react-spring/three";
import { extend } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'

const GlisteningMaterial = shaderMaterial(
  { uShine: -1.0, uColor: new THREE.Color('#222') },
  // vertex shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // fragment shader
  `
    uniform float uShine;
    uniform vec3 uColor;
    varying vec2 vUv;
    void main() {
      vec3 color = uColor;
      
      float band = vUv.x + vUv.y; 
      float shine = smoothstep(0.0, 0.2, 0.2 - abs(band - uShine));
      
      gl_FragColor = vec4(mix(color, vec3(1.0), shine * 0.8), 1.0);
    }
  `
)

extend({ GlisteningMaterial })

function Polaroid() {
    const playEffect = useDirection(s => s.reveal)
    const materialRef = useRef()
  
    useEffect(() => {
      if (playEffect && materialRef.current) {
           gsap.fromTo(materialRef.current.uniforms.uShine, 
            { value: -0.5 },
            { 
                value: 2.5, 
                duration: 1.5, 
                ease: "power2.inOut",
                delay: 0.5
            }
           )
      }
    }, [playEffect])
  
    return (
      <group>
         {/* Frame */}
         <mesh>
           <planeGeometry args={[1, 1.2]} />
           <meshStandardMaterial color="#f8f8f8" />
         </mesh>
         {/* Picture */}
         <mesh position={[0, 0.1, 0.001]}>
           <planeGeometry args={[0.8, 0.8]} />
           <glisteningMaterial ref={materialRef} uColor="#2c2c2c" /> 
         </mesh>
      </group>
    )
}

export default function PhotoCard() {
    const setPhase = useDirection(s => s.setPhase)
    const openTrigger = useDirection(s => s.open)
    const setReveal = useDirection(s => s.setReveal)

    // envelope prep
    const { nodes, animations } = useGLTF('/models/envelope.glb')
    const envelopeGroup = useRef()
    const { actions, names } = useAnimations(animations, envelopeGroup)

    const [springs, api] = useSpring(() => ({
        rotation: [Math.PI/2, 0, Math.PI],
        config: { mass: 5, tension: 400, friction: 50 },
    }))

    // polaroid picture scene
    const open = useCallback(() => {
        console.log('card opened')
        // send balloons up
        // turn envelope around
        // api.start(
        //     {
        //         from: {
        //             rotation: [0, 0, 0],
        //         },
        //         to: {
        //             rotation: [Math.PI, 0, 0],
        //         },
        //     }
        // )
        api.start({
            from: {
                rotation: [Math.PI/2, 0, Math.PI],
            },
            to: {
                rotation: [Math.PI/2, 0, 0],
            },
            reset: false,
            loop: false
        })
        // open it
        setTimeout(() => {
            names.forEach((name) => {
                const action = actions[name];
                if (action) {
                    action.reset().setLoop(LoopOnce)
                    action.clampWhenFinished = true;

                    // play forward
                    action.timeScale = 1
                    action.play()
                }
            });
            setTimeout(() => setReveal(true), 500)
        }, 1000)
        // reveal polaroid
    }, [api])

    const close = useCallback(() => {
        console.log('card closed')
        setReveal(false)
        
        names.forEach((name) => {
            const action = actions[name];
            if (action) {
                action.reset().setLoop(LoopOnce)
                action.clampWhenFinished = true;

                // play reverse
                action.timeScale = -1
                // start from the end
                action.time = action.getClip().duration
                action.play()
            }
        });

    }, [api])

    useEffect(() => {
        setPhase('dedication')
    }, [setPhase])

    useEffect(() => {
        // if open state, call open function
        // else, call close function
        if (openTrigger) open()
        // else close()
    }, [openTrigger, open])

    const envelopeColor = '#ccff00'
    return (
        <>
            
            <animated.group rotation={springs.rotation} position={[0, 1, -0.1]}>
                <group position={[0, -0.01, 1]} rotation={[-Math.PI/2, Math.PI, 0]}>
                   <Dedication/>
                </group>
                <group ref={envelopeGroup} dispose={null}>
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
                    {/* position and rotation */}
                    {/* text, glisten */}
                    <Polaroid />
                </group>
            </animated.group>
        </>
    )
}