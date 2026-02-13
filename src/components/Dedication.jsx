import { useEffect, useMemo, useState } from "react"
import { useDirection } from "../stores/useDirection"
import { safeDecode } from "../utils/safeDecode"
import HandwrittenText from "../helpers/HandwrittenText"

export function Dedication(props) {
  const phase = useDirection(s => s.phase)
  const [showDedication, setShowDedication] = useState(false)

  const dedication = useMemo(
    () =>
      decodeURIComponent(
        safeDecode(location.search.substring(1), {
          dedication: import.meta.env.VITE_DEDICATION || 'To Vania',
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
        position={[0, 0, 0]}
        lineWidth={0.009}
        scale={0.4}
        maxWidth={5}
        textAlign="center"
        center
        speed={200}
        lineHeight={20}
        {...props}
      >
        {dedication}
      </HandwrittenText>
    )
  )
}