import React, { useRef } from 'react';
import { PresentationControls } from '@react-three/drei';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import MacbookModel16 from '../models/Macbook-16';
import MacbookModel14 from '../models/Macbook-14';

const ANIMATION_DURATION = 1;      // en secondes
const OFFSET_DISTANCE = 5;         // déplacement latéral

// Applique une opacité avec animation GSAP, en gérant les matériaux multiples
const fadeMeshes = ({ group, opacity }: { group: any; opacity: number }) => {
  if (!group) return;
  group.traverse((child: any) => {
    if (child.isMesh) {
      const material = child.material;
      if (!material) return;
      // Rendre le matériau transparent si ce n'est pas déjà fait
      if (Array.isArray(material)) {
        material.forEach(mat => {
          mat.transparent = true;
          gsap.to(mat, { opacity, duration: ANIMATION_DURATION });
        });
      } else {
        material.transparent = true;
        gsap.to(material, { opacity, duration: ANIMATION_DURATION });
      }
    }
  });
};

// Anime la position X d'un groupe
const moveGroup = ({ group, x }: { group: any; x: number }) => {
  if (!group) return;
  gsap.to(group.position, { x, duration: ANIMATION_DURATION });
};

// Applique immédiatement (sans animation) l'opacité sur tous les meshes
const setImmediateOpacity = (group: any, opacity: number) => {
  if (!group) return;
  group.traverse((child: any) => {
    if (child.isMesh) {
      const material = child.material;
      if (!material) return;
      if (Array.isArray(material)) {
        material.forEach(mat => {
          mat.transparent = true;
          mat.opacity = opacity;
        });
      } else {
        material.transparent = true;
        material.opacity = opacity;
      }
    }
  });
};

const ModelSwitcher = ({ scale, isMobile }: { scale: number; isMobile: boolean }) => {

    const SCALE_LARGE_MOBILE = 0.05;
    const SCALE_LARGE_DESKTOP = 0.08;
  const smallMacbookRef = useRef<any>(null);
  const largeMacbookRef = useRef<any>(null);

  // Le scale passé détermine quel modèle montrer :
  // 0.08 ou 0.05 → grand modèle (16 pouces)
  // 0.06 ou 0.03 → petit modèle (14 pouces)
  const showLargeMacbook = scale === SCALE_LARGE_DESKTOP || scale === SCALE_LARGE_MOBILE;

  // Initialisation des positions et opacités de départ (sans animation)
  useGSAP(() => {
    if (!smallMacbookRef.current || !largeMacbookRef.current) return;

    if (showLargeMacbook) {
      // Grand visible, petit décalé et masqué
      gsap.set(smallMacbookRef.current.position, { x: -OFFSET_DISTANCE });
      gsap.set(largeMacbookRef.current.position, { x: 0 });
      setImmediateOpacity(smallMacbookRef.current, 0);
      setImmediateOpacity(largeMacbookRef.current, 1);
    } else {
      // Petit visible, grand décalé et masqué
      gsap.set(smallMacbookRef.current.position, { x: 0 });
      gsap.set(largeMacbookRef.current.position, { x: OFFSET_DISTANCE });
      setImmediateOpacity(smallMacbookRef.current, 1);
      setImmediateOpacity(largeMacbookRef.current, 0);
    }
  }, []); // Ne s'exécute qu'au montage

  // Animation quand `scale` change
  useGSAP(() => {
    if (!smallMacbookRef.current || !largeMacbookRef.current) return;

    if (showLargeMacbook) {
      moveGroup({ group: smallMacbookRef.current, x: -OFFSET_DISTANCE });
      moveGroup({ group: largeMacbookRef.current, x: 0 });
      fadeMeshes({ group: smallMacbookRef.current, opacity: 0 });
      fadeMeshes({ group: largeMacbookRef.current, opacity: 1 });
    } else {
      moveGroup({ group: smallMacbookRef.current, x: 0 });
      moveGroup({ group: largeMacbookRef.current, x: OFFSET_DISTANCE });
      fadeMeshes({ group: smallMacbookRef.current, opacity: 1 });
      fadeMeshes({ group: largeMacbookRef.current, opacity: 0 });
    }
  }, [scale]);

  const controlsConfig = {
    snap: false,
    speed: 1,
    zoom: 1,
    azimuth: [-Infinity, Infinity] as [number, number],
    config: { mass: 1, tension: 170, friction: 26 },
  };

  return (
    <>
      <PresentationControls {...controlsConfig}>
        <group ref={largeMacbookRef}>
          <MacbookModel16 scale={isMobile ? 0.05 : 0.08} position={[0, 0, 0]} />
        </group>
      </PresentationControls>
      <PresentationControls {...controlsConfig}>
        <group ref={smallMacbookRef}>
          <MacbookModel14 scale={isMobile ? 0.03 : 0.06} position={[0, 0, 0]} />
        </group>
      </PresentationControls>
    </>
  );
};

export default ModelSwitcher;