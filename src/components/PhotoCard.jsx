import { useEffect, useCallback, useRef } from "react";
import { useDirection } from "../stores/useDirection";
import { Dedication } from "./Dedication";
import { useThree, useFrame } from "@react-three/fiber";
import { BalloonPhysicsManager } from "./BalloonPhysics";
import * as CANNON from 'cannon-es';

export default function PhotoCard() {
    const setPhase = useDirection(s => s.setPhase)
    const openTrigger = useDirection(s => s.open)

    // Physics Manager Reference
    const physicsRef = useRef(null);
    const { scene } = useThree();

    // Initialize Physics
    useEffect(() => {
        if (physicsRef.current) return;

        const physics = new BalloonPhysicsManager(scene);
        physics.createGround(); 
        
        // ADD BALLOONS
        const balloonCount = 1;
        for (let i = 0; i < balloonCount; i++) {
            const x = (Math.random() - 0.5) * 15;
            const z = -5 + (Math.random() - 0.5) * 8; 
            const y = -4; // Raised up from -10 to be visible

            physics.addBalloon(new CANNON.Vec3(x, y, z));
        }

        physicsRef.current = physics;
    }, [scene]);

    // Animation Loop
    useFrame(() => {
        if (physicsRef.current) {
            physicsRef.current.update();
        }
    });

    // polaroid picture scene
    const open = useCallback(() => {
        console.log('card opened')
        // send balloons up
        if (physicsRef.current) {
            physicsRef.current.balloons.forEach(balloon => {
                setTimeout(() => {
                    balloon.release();
                }, Math.random() * 2000); 
            });
        }
    }, [])

    const close = useCallback(() => {
        console.log('card closed')
    }, [])

    useEffect(() => {
        setPhase('dedication')
    }, [setPhase])

    useEffect(() => {
        // if open state, call open function
        // else, call close function
        if (openTrigger) open()
        else close()
    }, [openTrigger, open])

    return (
        <>
            <Dedication/>
        </>
    )
}