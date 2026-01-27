import { Text3D } from "@react-three/drei";

export default function TestComponent() {
  console.log('TestComponent rendered');
  return <Text3D
    font="caveat.json"
    size={1}
    height={0.2}
    curveSegments={12}
    bevelEnabled={true}
    bevelThickness={0.03}
  >
    { 'hello' }
  </Text3D>
}