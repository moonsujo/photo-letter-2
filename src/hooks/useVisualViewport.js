import { useEffect, useState } from "react"

export function useVisualViewport() {
    const [viewport, setViewport] = useState({
        height: window.visualViewport?.height || window.innerHeight, // visualViewport gives the actual visible area
        // innerHeight gives the area covered behind things like the keyboard on a mobile device
        offsetTop: window.visualViewport?.offsetTop || 0,
    })

    useEffect(() => {
        const visualViewport = window.visualViewport

        if (!visualViewport) return

        const onResize = () => {
            setViewport({
                height: visualViewport.height,
                offsetTop: visualViewport.offsetTop,
            })
        }

        visualViewport.addEventListener('resize', onResize)
        visualViewport.addEventListener('scroll', onResize)

        return () => {
            visualViewport.removeEventListener('resize', onResize)
            visualViewport.removeEventListener('scroll', onResize)
        }
    }, [])

    return viewport
}