import { useState } from 'react'
import './Experience.css'
import { Center, OrthographicCamera, Text, Text3D } from '@react-three/drei'
import { useLoader } from '@react-three/fiber'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'

const FONT_URL = '/fonts/caveat.json' // Ensure this path is correct
const SAMPLE_RESOLUTION = 1
const PARSE_TIME_LIMIT_MS = 12

function useCaveatFont(text, options) {
  const [fontData, setFontData] = useState(null)
  const [strokes, setStrokes] = useState([])
  const [isParsing, setIsParsing] = useState(false)

  // 1. Load Font
  useEffect(() => {
    fetch(FONT_URL)
      .then(res => (res.ok ? res.json() : Promise.reject('Failed to load font')))
      .then(setFontData)
      .catch(console.error)
  }, [])

  // 2. Parse text in chunks
  useEffect(() => {
    if (!fontData || !text) {
      setStrokes([])
      return
    }

    let isCancelled = false
    setIsParsing(true)

    const pathElem = document.createElementNS('http://www.w3.org/2000/svg', 'path')

    const parseGlyph = (glyph) => {
      const paths = []
      let minX = Infinity
      let maxX = -Infinity

      if (!glyph.paths) return { paths, minX, maxX }

      glyph.paths.forEach(p => {
        pathElem.setAttribute('d', p.d)
        const len = pathElem.getTotalLength()
        if (len <= 0) return

        const points = [] // Vector3
        const sampleCount = Math.ceil(len / SAMPLE_RESOLUTION) + 1

        for (let i = 0; i <= sampleCount; i++) {
          const pt = pathElem.getPointAtLength((i / sampleCount) * len)
          const x = ((p.mx || 0) + pt.x) * SCALE
          const y = -((p.dy || 0) + pt.y) * SCALE
          points.push(new Vector3(x, y, 0))

          if (x < minX) minX = x
          if (x > maxX) maxX = x
        }
        paths.push(points)
      })
      return { paths, minX, maxX }
    }

    // generate
    const generate = async () => {
      const lines = []
      let currentLineStrokes = []
      let currentLineX = 0

      const paragraphs = text.split('\n')
      let loopStartTime = performance.now()

      for (const paragraph of paragraphs) {
        const words = paragraph.split(' ')

        for (const word of words) {
          if (performance.now() - loopStartTime > PARSE_TIME_LIMIT_MS) { // what if the time limit was longer?
            await new Promise(resolve => setTimeout(resolve, 0)) // parse, yield, repeat
            // asynchronous: run in sequence
            // guarantee 'generate' works for a short amount of time so the rest of the program can continue
            if (isCancelled) return
            loopStartTime = performance.now()
        }
      }
    }
  })
}
function HandwrittenText({ text }) {
  const font = useLoader(FontLoader, './caveat.json')
}
function Experience() {
  const [recipient, setRecipient] = useState('To You')

  return (<>
    <group name='setup'>
      <OrthographicCamera/>
    </group>
    <Center>
      <HandwrittenText text={recipient} />
    </Center>
  </>)
}

export default Experience
