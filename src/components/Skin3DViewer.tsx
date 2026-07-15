'use client';
import React, { useEffect, useRef } from 'react';
import * as skinview3d from 'skinview3d';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface Skin3DViewerProps {
  skinUrl: string;
  width?: number;
  height?: number;
}

export default function Skin3DViewer({ skinUrl, width = 200, height = 280 }: Skin3DViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !skinUrl) return;

    // Initialize the 3D skin viewer context
    const skinViewer = new skinview3d.SkinViewer({
      canvas: canvasRef.current,
      width: width,
      height: height,
      skin: skinUrl
    });

    // Configure walking animation and auto-rotation
    skinViewer.animation = new skinview3d.WalkingAnimation();
    skinViewer.animation.speed = 0.6;
    skinViewer.autoRotate = true;
    skinViewer.autoRotateSpeed = 0.5;

    // Configure user mouse interactive orbit controls
    const controls = new OrbitControls(skinViewer.camera, skinViewer.renderer.domElement);
    controls.enableZoom = false; // Prevent page scroll zoom hijacking
    controls.enablePan = false;

    // Clean up Three.js context on unmount to prevent WebGL context leaks
    return () => {
      skinViewer.dispose();
    };
  }, [skinUrl, width, height]);

  return (
    <div style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <canvas 
        ref={canvasRef} 
        style={{ 
          maxWidth: '100%', 
          cursor: 'grab',
          filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.4))'
        }} 
      />
      <span style={{ 
        position: 'absolute', 
        bottom: '4px', 
        fontSize: '0.65rem', 
        opacity: 0.35, 
        pointerEvents: 'none',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
      }}>
        🖱️ Click & Drag to Rotate
      </span>
    </div>
  );
}
