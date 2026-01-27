import { useEffect, useMemo, useState } from "react"
import { MathUtils } from "three"
import { useDirection } from "../stores/useDirection"
import { safeDecode } from "../utils/safeDecode"
import HandwrittenText from "../helpers/HandwrittenText"

export function Dedication() {
  console.log('Dedication rendered');
  const phase = useDirection(s => s.phase)
  const [showDedication, setShowDedication] = useState(false)

  const dedication = useMemo(
    () =>
      decodeURIComponent(
        safeDecode(location.search.substring(1), {
          dedication: import.meta.env.VITE_DEDICATION || 'To you',
        }).dedication,
      ),
    [],
  )

  useEffect(() => {
    document.title = dedication
  }, [dedication])

  useEffect(() => {
    if (phase === 'loading') return

    const timeout = setTimeout(() => setShowDedication(true), 500)
    return () => clearTimeout(timeout)
  }, [phase, setShowDedication])

  if (phase === 'loading') return

  return (
    showDedication && (
      <HandwrittenText
        position={[1.83, 0.02, 0]}
        rotation-x={MathUtils.degToRad(-90)}
        lineWidth={0.01}
        scale={0.2}
        maxWidth={6}
        textAlign="center"
        center
        speed={phase > 'dedication' ? 20 : 3}
      >
        {dedication}
      </HandwrittenText>
    )
  )
}