import { useRef, useMemo, useCallback, useState, useEffect, Component } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const DEFAULT_DEPTH_RANGE = 50;
const MAX_HORIZONTAL_OFFSET = 8;
const MAX_VERTICAL_OFFSET = 8;

// ── Error Boundary ─────────────────────────────────────────────────
class CanvasErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error) {
    console.warn('[InfiniteGallery] WebGL error caught:', error.message);
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback || null;
    }
    return this.props.children;
  }
}

// ── Safe texture loader (no useTexture — avoids Suspense crash) ───
function useTexturesSafe(urls) {
  const [textures, setTextures] = useState([]);
  const urlKey = urls.join('|');

  useEffect(() => {
    if (!urls.length) return;

    const loaded = new Array(urls.length).fill(null);
    let count = 0;

    const finish = (i, tex) => {
      loaded[i] = tex;
      count++;
      if (count === urls.length) {
        setTextures([...loaded]);
      }
    };

    urls.forEach((url, i) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const tex = new THREE.Texture(img);
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.needsUpdate = true;
        finish(i, tex);
      };
      img.onerror = () => {
        // Fallback: solid dark canvas texture
        const c = document.createElement('canvas');
        c.width = 4; c.height = 4;
        const ctx = c.getContext('2d');
        ctx.fillStyle = '#1a0808';
        ctx.fillRect(0, 0, 4, 4);
        const fallbackTex = new THREE.CanvasTexture(c);
        finish(i, fallbackTex);
      };
      img.src = url;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlKey]);

  return textures;
}

// ── Cloth shader material factory ─────────────────────────────────
const createClothMaterial = () =>
  new THREE.ShaderMaterial({
    transparent: true,
    side: THREE.FrontSide,
    uniforms: {
      map: { value: null },
      opacity: { value: 1.0 },
      blurAmount: { value: 0.0 },
      scrollForce: { value: 0.0 },
      time: { value: 0.0 },
      isHovered: { value: 0.0 },
    },
    vertexShader: `
      uniform float scrollForce;
      uniform float time;
      uniform float isHovered;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        vec3 pos = position;
        float curve = length(pos.xy) * length(pos.xy) * scrollForce * 0.25;
        float ripple = (sin(pos.x * 2.0 + scrollForce * 3.0) * 0.015
                      + sin(pos.y * 2.5 + scrollForce * 2.0) * 0.01)
                      * abs(scrollForce) * 2.0;
        float flag = 0.0;
        if (isHovered > 0.5) {
          float d = smoothstep(-0.5, 0.5, pos.x);
          flag = sin(pos.x * 3.0 + time * 8.0) * 0.08 * d
               + sin(pos.x * 5.0 + time * 12.0) * 0.025 * d;
        }
        pos.z -= (curve + ripple + flag);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D map;
      uniform float opacity;
      uniform float blurAmount;
      varying vec2 vUv;
      void main() {
        vec4 color;
        if (blurAmount > 0.1) {
          vec4 blurred = vec4(0.0);
          float total = 0.0;
          float s = blurAmount * 0.004;
          for (float x = -2.0; x <= 2.0; x += 1.0) {
            for (float y = -2.0; y <= 2.0; y += 1.0) {
              float w = 1.0 / (1.0 + length(vec2(x, y)));
              blurred += texture2D(map, vUv + vec2(x, y) * s) * w;
              total += w;
            }
          }
          color = blurred / total;
        } else {
          color = texture2D(map, vUv);
        }
        gl_FragColor = vec4(color.rgb, color.a * opacity);
      }
    `,
  });

// ── Single mesh plane ─────────────────────────────────────────────
function ImagePlane({ meshRef, texture, position, scale, material }) {
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (material && texture) material.uniforms.map.value = texture;
  }, [material, texture]);

  useEffect(() => {
    if (material?.uniforms) material.uniforms.isHovered.value = hovered ? 1 : 0;
  }, [material, hovered]);

  return (
    <mesh
      ref={meshRef}
      position={position}
      scale={scale}
      material={material}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <planeGeometry args={[1, 1, 20, 20]} />
    </mesh>
  );
}

// ── Inner scene ───────────────────────────────────────────────────
function GalleryScene({ images, speed, visibleCount, fadeSettings, blurSettings }) {
  const { gl } = useThree();
  const canvas = gl.domElement;
  const elapsedRef = useRef(0);
  const velRef = useRef(0);
  const autoRef = useRef(true);
  const lastInteract = useRef(Date.now());
  const meshRefs = useRef([]);

  const normalized = useMemo(
    () => images.map((img) => (typeof img === 'string' ? { src: img, alt: '' } : img)),
    [images]
  );
  const urls = useMemo(() => normalized.map((i) => i.src), [normalized]);
  const textures = useTexturesSafe(urls);

  const materials = useMemo(
    () => Array.from({ length: visibleCount }, createClothMaterial),
    [visibleCount]
  );

  const positions = useMemo(() =>
    Array.from({ length: visibleCount }, (_, i) => ({
      x: (Math.sin((i * 2.618) % (Math.PI * 2)) * (i % 3) * 1.2 * MAX_HORIZONTAL_OFFSET) / 3,
      y: (Math.cos((i * 1.618 + Math.PI / 3) % (Math.PI * 2)) * ((i + 1) % 4) * 0.8 * MAX_VERTICAL_OFFSET) / 4,
    })),
    [visibleCount]
  );

  const totalImages = normalized.length;
  const depthRange = DEFAULT_DEPTH_RANGE;

  const planes = useRef(
    Array.from({ length: visibleCount }, (_, i) => ({
      index: i,
      z: ((depthRange / Math.max(visibleCount, 1)) * i) % depthRange,
      imageIndex: i % Math.max(totalImages, 1),
      x: positions[i]?.x ?? 0,
      y: positions[i]?.y ?? 0,
    }))
  );

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    velRef.current += e.deltaY * 0.01 * speed;
    autoRef.current = false;
    lastInteract.current = Date.now();
  }, [speed]);

  const handleKey = useCallback((e) => {
    const dir = (e.key === 'ArrowUp' || e.key === 'ArrowLeft') ? -1 : (e.key === 'ArrowDown' || e.key === 'ArrowRight') ? 1 : 0;
    if (!dir) return;
    velRef.current += dir * 2 * speed;
    autoRef.current = false;
    lastInteract.current = Date.now();
  }, [speed]);

  useEffect(() => {
    if (!canvas) return;
    canvas.addEventListener('wheel', handleWheel, { passive: false });
    document.addEventListener('keydown', handleKey);
    return () => {
      canvas.removeEventListener('wheel', handleWheel);
      document.removeEventListener('keydown', handleKey);
    };
  }, [canvas, handleWheel, handleKey]);

  useEffect(() => {
    const iv = setInterval(() => {
      if (Date.now() - lastInteract.current > 3000) autoRef.current = true;
    }, 1000);
    return () => clearInterval(iv);
  }, []);

  useFrame((_, delta) => {
    elapsedRef.current += delta;
    if (autoRef.current) velRef.current += 0.3 * delta;
    velRef.current *= 0.95;
    const vel = velRef.current;
    const t = elapsedRef.current;
    const range = depthRange;
    const advance = totalImages > 0 ? visibleCount % totalImages || totalImages : 0;

    materials.forEach((m) => {
      if (!m?.uniforms) return;
      m.uniforms.time.value = t;
      m.uniforms.scrollForce.value = vel;
    });

    planes.current.forEach((plane, i) => {
      let z = plane.z + vel * delta * 10;
      const fw = z >= range ? Math.floor(z / range) : 0;
      const bw = z < 0 ? Math.ceil(-z / range) : 0;
      if (fw > 0) { z -= range * fw; plane.imageIndex = (plane.imageIndex + fw * advance) % Math.max(totalImages, 1); }
      if (bw > 0) { z += range * bw; plane.imageIndex = ((plane.imageIndex - bw * advance) % Math.max(totalImages, 1) + Math.max(totalImages, 1)) % Math.max(totalImages, 1); }
      plane.z = ((z % range) + range) % range;
      plane.x = positions[i]?.x ?? 0;
      plane.y = positions[i]?.y ?? 0;

      const np = plane.z / range;
      const { fadeIn: fi, fadeOut: fo } = fadeSettings;
      let op = np < fi.start ? 0 : np <= fi.end ? (np - fi.start) / (fi.end - fi.start)
             : np >= fo.end ? 0 : np >= fo.start ? 1 - (np - fo.start) / (fo.end - fo.start) : 1;
      op = Math.max(0, Math.min(1, op));

      const { blurIn: bi, blurOut: bo, maxBlur } = blurSettings;
      let blur = np < bi.start ? maxBlur : np <= bi.end ? maxBlur * (1 - (np - bi.start) / (bi.end - bi.start))
               : np >= bo.end ? maxBlur : np >= bo.start ? maxBlur * ((np - bo.start) / (bo.end - bo.start)) : 0;
      blur = Math.max(0, Math.min(maxBlur, blur));

      const m = materials[i];
      if (m?.uniforms) { m.uniforms.opacity.value = op; m.uniforms.blurAmount.value = blur; }

      // Update mesh position, scale, and texture imperatively
      const mesh = meshRefs.current[i];
      if (mesh) {
        mesh.position.set(plane.x, plane.y, plane.z - depthRange / 2);
        const tex = textures[plane.imageIndex];
        if (tex) {
          if (m && m.uniforms.map.value !== tex) {
            m.uniforms.map.value = tex;
            const img = tex.image;
            const aspect = img?.width && img?.height ? img.width / img.height : 1.5;
            const sc = aspect >= 1 ? [2 * aspect, 2, 1] : [2, 2 / aspect, 1];
            mesh.scale.set(sc[0], sc[1], sc[2]);
          }
        }
      }
    });
  });

  if (!textures.length || !totalImages) return null;

  return (
    <>
      {planes.current.map((plane, i) => {
        const tex = textures[plane.imageIndex];
        const mat = materials[i];
        if (!tex || !mat) return null;
        const img = tex.image;
        const aspect = img?.width && img?.height ? img.width / img.height : 1.5;
        const sc = aspect >= 1 ? [2 * aspect, 2, 1] : [2, 2 / aspect, 1];
        return (
          <ImagePlane
            key={plane.index}
            meshRef={(el) => { meshRefs.current[i] = el; }}
            texture={tex}
            position={[plane.x, plane.y, plane.z - depthRange / 2]}
            scale={sc}
            material={mat}
          />
        );
      })}
    </>
  );
}

// ── Fallback carousel for no-WebGL ───────────────────────────────
function FallbackGallery({ images }) {
  const [idx, setIdx] = useState(0);
  const imgs = images.map((img) => (typeof img === 'string' ? { src: img, alt: '' } : img));
  useEffect(() => {
    const iv = setInterval(() => setIdx((p) => (p + 1) % imgs.length), 2500);
    return () => clearInterval(iv);
  }, [imgs.length]);
  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      {imgs.map((img, i) => (
        <img
          key={i}
          src={img.src}
          alt={img.alt || ''}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${i === idx ? 'opacity-100' : 'opacity-0'}`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
    </div>
  );
}

// ── Public export ─────────────────────────────────────────────────
export default function InfiniteGallery({
  images,
  speed = 1,
  visibleCount = 8,
  className = 'h-96 w-full',
  style,
  fadeSettings = {
    fadeIn: { start: 0.05, end: 0.25 },
    fadeOut: { start: 0.4, end: 0.43 },
  },
  blurSettings = {
    blurIn: { start: 0.0, end: 0.1 },
    blurOut: { start: 0.4, end: 0.43 },
    maxBlur: 6.0,
  },
}) {
  const [webglOk, setWebglOk] = useState(true);

  useEffect(() => {
    try {
      const c = document.createElement('canvas');
      const gl = c.getContext('webgl') || c.getContext('experimental-webgl');
      if (!gl) setWebglOk(false);
    } catch {
      setWebglOk(false);
    }
  }, []);

  const fallback = <FallbackGallery images={images} />;

  if (!webglOk) {
    return <div className={className} style={style}>{fallback}</div>;
  }

  return (
    <div className={className} style={style}>
      <CanvasErrorBoundary fallback={fallback}>
        <Canvas
          camera={{ position: [0, 0, 0], fov: 55 }}
          gl={{ antialias: true, alpha: true }}
          onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
        >
          <GalleryScene
            images={images}
            speed={speed}
            visibleCount={visibleCount}
            fadeSettings={fadeSettings}
            blurSettings={blurSettings}
          />
        </Canvas>
      </CanvasErrorBoundary>
    </div>
  );
}
