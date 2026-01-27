import { a, config, useTransition } from "@react-spring/three";
import { useDirection } from "../stores/useDirection";
import HandwrittenText from "../helpers/HandwrittenText";
import { useEffect, useState } from "react";
import { MathUtils } from "three";

export default function Loading() {
  const phase = useDirection(s => s.phase);
  const [speed, setSpeed] = useState(0)

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (phase === 'loading') setSpeed(20)
    }, 1000)

    return () => clearTimeout(timeout)
  })

  const transition = useTransition(phase, {
    from: { positionY: 0, opacity: 0 },
    enter: { positionY: 0, opacity: 1 },
    leave: { positionY: -1, opacity: 0 },
    config: config.molasses
  })

  return transition(
    (spring, phase) =>
      phase === 'loading' && (
        <a.group position-y={spring.positionY}>
          <mesh scale={[3.66, 0.08, 5.14]}>
            <boxGeometry />
            <a.meshStandardMaterial color="#F4D75B" transparent opacity={spring.opacity} />
          </mesh>

          <HandwrittenText
            position-y={0.05}
            rotation-x={MathUtils.degToRad(-90)}
            lineWidth={0.01}
            scale={0.2}
            speed={speed}
            center
          >
            Loading
          </HandwrittenText>
        </a.group>
      )
  )
}