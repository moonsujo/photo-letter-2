import { useVisualViewport } from "../hooks/useVisualViewport"
import { a, config, useTransition } from "@react-spring/web"
import { useDirection } from "../stores/useDirection"
import { Button } from "./Button"

export default function UI() {

    const { height: viewportHeight, offsetTop: viewportOffsetTop } = useVisualViewport()

    const phase = useDirection(s => s.phase)
    const setPhase = useDirection(s => s.setPhase)

    // open state
    // edit mode state
    // editor phase state

    const transitionConfig = {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
        config: config.molasses
    }

    const startActionTransition = useTransition(phase === 'dedication', {
        ...transitionConfig,
        delay: phase === 'dedication' ? 1000 : 0
    })

    console.log('UI') 
    return <div
        className="fixed left-0 w-full pointer-events-none font-satisfy"
        style={{
            height: viewportHeight,
            top: viewportOffsetTop,
        }}
    >
        {startActionTransition(
            (spring, show) => 
                show && (
                    <Button
                        // control style via classes
                        className="absolute! bottom-4 left-1/2 -translate-x-1/2 text-2xl w-26"
                        style={spring}
                        onClick={() => setPhase('opening')}
                    >
                        Unfold
                    </Button>
                )
        )}
    </div>
}