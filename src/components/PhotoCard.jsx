import { useEffect, useCallback, useRef } from "react";
import { useDirection } from "../stores/useDirection";
import { Dedication } from "./Dedication";
import { useThree, useFrame } from "@react-three/fiber";
import { BalloonPhysicsManager } from "./BalloonPhysics";
import * as CANNON from 'cannon-es';
import { Envelope } from "../models/envelope";

export default function PhotoCard() {
    const setPhase = useDirection(s => s.setPhase)
    const openTrigger = useDirection(s => s.open)

    // polaroid picture scene
    const open = useCallback(() => {
        console.log('card opened')
        // send balloons up
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
            <Envelope rotation={[Math.PI/2, 0, 0]} position={[0, 1, -0.1]} open={openTrigger} />
        </>
    )
}