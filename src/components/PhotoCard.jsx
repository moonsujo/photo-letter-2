import { useEffect } from "react";
import { useDirection } from "../stores/useDirection";
import { Dedication } from "./Dedication";

export default function PhotoCard() {
    const setPhase = useDirection(s => s.setPhase)

    // polaroid picture scene

    useEffect(() => {
        setPhase('dedication')
    }, [setPhase])

    useEffect(() => {
        // if open state, call open function
        // else, call close function
    })

    return (
        <>
            <Dedication/>
        </>
    )
}