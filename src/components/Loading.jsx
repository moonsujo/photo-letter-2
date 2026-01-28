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
      if (phase === 'loading') setSpeed(200)
    }, 1000)

    return () => clearTimeout(timeout)
  })

  return phase === 'loading' && <HandwrittenText
    lineWidth={0.01}
    scale={0.2}
    speed={speed}
    center
  >
    loading
  </HandwrittenText>
}