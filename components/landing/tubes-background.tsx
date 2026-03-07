"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { TubeGeometry, Vector3, CatmullRomCurve3, Mesh } from "three";
import { Float } from "@react-three/drei";

function Tube({ color, speed, offset, scale }: { color: string, speed: number, offset: number, scale: number }) {
  const meshRef = useRef<Mesh>(null!);

  // Create a wavy curve
  const points = [];
  for (let i = 0; i < 10; i++) {
    points.push(new Vector3((i - 5) * 2, Math.sin(i + offset) * 2, Math.cos(i + offset) * 2));
  }
  const curve = new CatmullRomCurve3(points);
  const tubeGeo = new TubeGeometry(curve, 64, 0.4 * scale, 8, false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * speed;
      meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.5;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef} geometry={tubeGeo}>
        <meshStandardMaterial 
          color={color} 
          wireframe={true} 
          transparent={true} 
          opacity={0.3} 
          emissive={color}
          emissiveIntensity={0.5}
        />
      </mesh>
    </Float>
  );
}

export function TubesBackground() {
  return (
    <div className="absolute inset-0 z-0 bg-[#030712] overflow-hidden">
        <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <Tube color="#10b981" speed={0.1} offset={0}  scale={1} />
          <Tube color="#3b82f6" speed={0.05} offset={2} scale={1.5} />
          <Tube color="#8b5cf6" speed={0.08} offset={5} scale={0.8} />
          <Tube color="#0ea5e9" speed={0.12} offset={8} scale={1.2} />
        </Canvas>
        
        {/* Overlay gradient to fade out bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#030712] pointer-events-none" />
    </div>
  );
}
