import * as THREE from "three"
import React, { useRef, useMemo } from "react"
import { Canvas, useFrame } from "react-three-fiber"
import Effects from "./Effects"

const map = (value, x1, y1, x2, y2) => ((value - x1) * (y2 - x2)) / (y1 - x1) + x2

function getColor(value) {
  //value from 0 to 1
  const hue = ((1 - value) * 120).toString(10)
  return ["hsl(", hue, ",100%,50%)"].join("")
}

const tempObject = new THREE.Object3D()
const tempColor = new THREE.Color()

function Boxes({ generatedMw }) {
  const colors = useMemo(
    () => new Array(1000).fill().map(() => getColor(map(generatedMw, 0, 2000, 0, 1))),
    [generatedMw]
  )

  const colorArray = useMemo(
    () =>
      Float32Array.from(
        new Array(1000).fill().flatMap((_, i) => tempColor.set(colors[i]).toArray())
      ),
    [colors]
  )

  const ref = useRef()

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    ref.current.rotation.x = Math.sin(time / 4)
    ref.current.rotation.y = Math.sin(time / 2)
    let i = 0
    for (let x = 0; x < 10; x++)
      for (let y = 0; y < 10; y++)
        for (let z = 0; z < 10; z++) {
          const id = i++
          tempObject.position.set(5 - x, 5 - y, 5 - z)
          tempObject.rotation.y =
            Math.sin(x / 4 + time) + Math.sin(y / 4 + time) + Math.sin(z / 4 + time)
          tempObject.rotation.z = tempObject.rotation.y * 2

          const scale = 1
          tempObject.scale.set(scale, scale, scale)
          tempObject.updateMatrix()
          ref.current.setMatrixAt(id, tempObject.matrix)
        }
    ref.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={ref} args={[null, null, 1000]}>
      <boxBufferGeometry attach="geometry" args={[0.7, 0.7, 0.7]}>
        <instancedBufferAttribute attachObject={["attributes", "color"]} args={[colorArray, 3]} />
      </boxBufferGeometry>
      <meshPhongMaterial attach="material" vertexColors={THREE.VertexColors} />
    </instancedMesh>
  )
}

const ReactorCore = (props) => (
  <Canvas
    style={{ width: "100vw", height: "100vh" }}
    gl={{ antialias: false, alpha: true }}
    camera={{ position: [0, 0, 15], near: 10, far: 20 }}
    onCreated={({ gl }) => gl.setClearColor("#14121F")}
  >
    <ambientLight />
    <pointLight position={[150, 150, 150]} intensity={0.55} />
    <Boxes {...props} />
    <Effects />
  </Canvas>
)

export default ReactorCore
