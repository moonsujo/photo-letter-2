import { useEffect, useCallback, useRef, useState, forwardRef } from "react";
import { useDirection } from "../stores/useDirection";
import { Dedication } from "./Dedication";
import { useGLTF, useAnimations, shaderMaterial } from '@react-three/drei'
import { LoopOnce, DoubleSide } from 'three'
import HandwrittenText from '../helpers/HandwrittenText'

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

// enables writing <glisteningMaterial /> in JSX, 
// and the shader is compiled in the GPU's driver and runs on the card.
extend({ GlisteningMaterial })

const Polaroid = forwardRef((props, ref) => {
    const playEffect = useDirection(s => s.reveal)
    const materialRef = useRef()
    const writeFrontText = useDirection(s => s.writeFrontText)
  
    useEffect(() => {
        console.log('playEffect changed:', playEffect)
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
      <group ref={ref} {...props} >
         {/* Frame */}
         <mesh >
           <planeGeometry args={[1, 1.2]} />
           <meshStandardMaterial color="#f8f8f8" side={DoubleSide} />
         </mesh>
         {/* Picture */}
         <mesh position={[0, -0.1, -0.0001]}>
           <planeGeometry args={[0.9, 0.9]} />
           <glisteningMaterial ref={materialRef} uColor="#2c2c2c" side={DoubleSide}/> 
         </mesh>
         {/* Text */} 
         <group position={[0, -0.4, 0.1]} rotation={[-Math.PI, 0, 0]}>
            {writeFrontText && (
                <HandwrittenText 
                    position={[0, -0.3, 0.21]}
                    lineWidth={0.005}
                    scale={0.15}
                    maxWidth={5}
                    textAlign="center"
                    center
                    speed={200}
                    lineHeight={25}
                    color='white'
                >
                    {`Happy Birthday!\nI made a puzzle for you`}
                </HandwrittenText>
            )}
         </group>
      </group>
    )
})

export default function PhotoCard() {
    const setPhase = useDirection(s => s.setPhase)
    const openTrigger = useDirection(s => s.open)
    const setReveal = useDirection(s => s.setReveal)
    const setWriteFrontText = useDirection(s => s.setWriteFrontText)

    console.log('photo card rendered')

    // envelope prep
    const { nodes, animations } = useGLTF('/models/envelope.glb')
    const envelopeGroup = useRef()
    const polaroidRef = useRef()
    const { actions, names } = useAnimations(animations, envelopeGroup)

    const [springs, api] = useSpring(() => ({
        rotation: [Math.PI/2, 0, Math.PI],
        config: { mass: 5, tension: 400, friction: 50 },
    }))

    // polaroid picture scene
    const open = useCallback(() => {
        console.log('card opened')
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

        console.log('animation started')
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
            // polaroid animation:
            // pop it out of envelope - upward, forward, downward arc with gsap
            if (polaroidRef.current) {
                const tl = gsap.timeline({
                    delay: 1,
                    onComplete: () => {
                        // glisten polaroid later
                        setTimeout(() => {
                            setReveal(true)
                        }, 200)
                        setTimeout(() => {
                            setWriteFrontText(true)
                        }, 2000)
                    }
                })

                // -z is up
                tl.to(polaroidRef.current.position, {
                    y: 0,
                    z: -1,
                    duration: 0.5,
                    ease: "power2.out"
                })
                .to(polaroidRef.current.position, {
                    y: 3,
                    z: 1,
                    duration: 0.5,
                    ease: "power2.inOut"
                })
            }
        }, 1000)
        // reveal polaroid
    }, [api, names, actions, setReveal])

    const close = useCallback(() => {
        console.log('card closed')
        setReveal(false)
        setWriteText(false)
        
        // Reset polaroid position
        if (polaroidRef.current) {
            gsap.to(polaroidRef.current.position, {
                y: 0.0001, // original y (relative to parent space it was 0 or epsilon)
                z: 1,      // original z
                duration: 0.5
            })
            // Reset rotation
            gsap.to(polaroidRef.current.rotation, {
                x: -Math.PI/2,
                y: 0,
                z: 0,
                duration: 0.5
            })
        }
        
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

    }, [api, names, actions, setReveal])

    useEffect(() => {
        setPhase('dedication')
    }, [setPhase])

    useEffect(() => {
        // if open state, call open function
        // else, call close function
        if (openTrigger) open()
        console.log('open trigger changed:', openTrigger, 'current open function:', open)
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
                    <Polaroid 
                        ref={polaroidRef}
                        position={[0, 0.0001, 1]} 
                        rotation={[Math.PI/2, 0, 0]}
                    />
                </group>
            </animated.group>
        </>
    )
}