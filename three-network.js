import * as THREE from "three"

export function initThreeNetwork() {
  const canvas = document.getElementById("three-canvas")
  if (!canvas) {
    console.error("Three.js canvas not found!")
    return
  }

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true })

  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)

  // Lights
  const ambientLight = new THREE.AmbientLight(0xaaaaaa)
  scene.add(ambientLight)

  const pointLight = new THREE.PointLight(0x00ff81, 1, 100)
  pointLight.position.set(0, 0, 50)
  scene.add(pointLight)

  // Network parameters
  const numNodes = 50
  const nodeRadius = 0.1
  const connectionDensity = 0.1 // Probability of a connection between two nodes
  const maxConnectionDistance = 5 // Max distance for a connection

  const nodes = []
  const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0x00df81 }) // Primary color
  const nodeGeometry = new THREE.SphereGeometry(nodeRadius, 16, 16)

  // Create nodes
  for (let i = 0; i < numNodes; i++) {
    const node = new THREE.Mesh(nodeGeometry, nodeMaterial)
    node.position.set((Math.random() - 0.5) * 20, (Math.random() - 0.5) * 15, (Math.random() - 0.5) * 10)
    node.userData.velocity = new THREE.Vector3(
      (Math.random() - 0.5) * 0.01,
      (Math.random() - 0.5) * 0.01,
      (Math.random() - 0.5) * 0.01,
    )
    nodes.push(node)
    scene.add(node)
  }

  // Create connections
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00df81, transparent: true, opacity: 0.3 })
  const connections = []

  for (let i = 0; i < numNodes; i++) {
    for (let j = i + 1; j < numNodes; j++) {
      if (Math.random() < connectionDensity) {
        const nodeA = nodes[i]
        const nodeB = nodes[j]
        const distance = nodeA.position.distanceTo(nodeB.position)

        if (distance < maxConnectionDistance) {
          const points = []
          points.push(nodeA.position)
          points.push(nodeB.position)
          const geometry = new THREE.BufferGeometry().setFromPoints(points)
          const line = new THREE.Line(geometry, lineMaterial)
          connections.push(line)
          scene.add(line)
        }
      }
    }
  }

  camera.position.z = 10

  // Mouse interaction for parallax effect
  let mouseX = 0
  let mouseY = 0
  const targetX = new THREE.Vector3()
  const targetY = new THREE.Vector3()

  canvas.addEventListener("mousemove", (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1
  })

  canvas.addEventListener("mouseleave", () => {
    mouseX = 0
    mouseY = 0
  })

  // Animation loop
  function animate() {
    requestAnimationFrame(animate)

    // Update camera position based on mouse
    targetX.set(mouseX * 0.5, 0, 0)
    targetY.set(0, mouseY * 0.5, 0)
    camera.position.lerp(new THREE.Vector3(targetX.x, targetY.y, 10), 0.05)

    // Animate nodes
    nodes.forEach((node) => {
      node.position.add(node.userData.velocity)

      // Bounce off boundaries
      if (node.position.x > 10 || node.position.x < -10) node.userData.velocity.x *= -1
      if (node.position.y > 7.5 || node.position.y < -7.5) node.userData.velocity.y *= -1
      if (node.position.z > 5 || node.position.z < -5) node.userData.velocity.z *= -1
    })

    // Update connections
    connections.forEach((line) => {
      const positions = line.geometry.attributes.position.array
      const startNode = nodes.find((n) => n.position.equals(line.geometry.attributes.position.array.slice(0, 3)))
      const endNode = nodes.find((n) => n.position.equals(line.geometry.attributes.position.array.slice(3, 6)))

      if (startNode && endNode) {
        positions[0] = startNode.position.x
        positions[1] = startNode.position.y
        positions[2] = startNode.position.z
        positions[3] = endNode.position.x
        positions[4] = endNode.position.y
        positions[5] = endNode.position.z
        line.geometry.attributes.position.needsUpdate = true
      }
    })

    renderer.render(scene, camera)
  }

  animate()

  // Handle window resizing
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  })
}

// Initialize Three.js when the DOM is ready
document.addEventListener("DOMContentLoaded", initThreeNetwork)
