'use client';
import * as THREE from 'three';
import {Canvas} from '@react-three/fiber';
import {ContactShadows, Float, Environment} from '@react-three/drei';
import {Suspense, useEffect, useRef, useState} from 'react';
import {gsap} from 'gsap';

export default function Shapes() {
	return (
		<div className="row-span-1 row-start-1 -mt-9 aspect-square  md:col-span-1 md:col-start-2 md:mt-0">
			<Canvas
				className="z-0"
				shadows
				gl={{antialias: false}}
				dpr={[1, 1.5]}
				camera={{position: [0, 0, 25], fov: 30, near: 1, far: 40}}
			>
				<Suspense fallback={null}>
					<Geometries />
					<ContactShadows
						position={[0, -3.5, 0]}
						opacity={0.65}
						scale={40}
						blur={1}
						far={9}
					/>
					<Environment preset="forest" />
				</Suspense>
			</Canvas>
		</div>
	);
}

function Geometries() {
	const geometries = [
		// {
		// 	position: [0, 0, 0],
		// 	r: 0.5,
		// 	geometry: new THREE.IcosahedronGeometry(4), // Gem
		// },
		{
			position: [0, 1, 0],
			r: 1,
			geometry: new THREE.SphereGeometry(1, 15, 16), // Pill
		},
		// {
		// 	position: [-1.4, 2, -4],
		// 	r: 0.6,
		// 	geometry: new THREE.SphereGeometry(1.2, 23, 1), // Soccer ball
		// },
		{
			position: [0, 1, 0],
			r: 0.5,
			geometry: new THREE.TorusGeometry(3, 1, 13, 32), // Donut
		},
		// {
		// 	position: [1.6, 1.6, -4],
		// 	r: 0.7,
		// 	geometry: new THREE.OctahedronGeometry(1.5), // Diamond
		// },
	];

	const materials = [
		// new THREE.MeshStandardMaterial(),
		// new THREE.MeshStandardMaterial({
		// 	color: 0x2ecc71,
		// 	roughness: 1,
		// 	metalness: 1,
		// }),
		// new THREE.MeshStandardMaterial({
		// 	color: 0xf1c40f,
		// 	roughness: 1,
		// 	metalness: 1,
		// }),
		// new THREE.MeshStandardMaterial({
		// 	color: 0xe74c3c,
		// 	roughness: 1,
		// 	metalness: 1,
		// }),
		// new THREE.MeshStandardMaterial({
		// 	color: 0x8e44ad,
		// 	roughness: 1,
		// 	metalness: 1,
		// }),
		// new THREE.MeshStandardMaterial({
		// 	color: 0x1abc9c,
		// 	roughness: 1,
		// 	metalness: 1,
		// }),
		// new THREE.MeshStandardMaterial({
		// 	roughness: 0.2,
		// 	metalness: 1,
		// 	color: 0x2980b9,
		// }),
		new THREE.MeshStandardMaterial({
			color: 0x2c3e50,
			roughness: 0.1,
			metalness: 1,
		}),
	];

	const soundEffects = [
		new Audio('/sounds/knock1.ogg'),
		new Audio('/sounds/knock2.ogg'),
		new Audio('/sounds/knock3.ogg'),
		new Audio('/sounds/knock4.ogg'),
		new Audio('/sounds/knock5.ogg'),
	];

	//Pass To Geometry

	return geometries.map(({position, r, geometry}) => (
		<Geometry
			key={JSON.stringify(position)} // Unique key
			position={position.map((p) => p * 2)}
			geometry={geometry}
			soundEffects={soundEffects}
			materials={materials}
			r={r}
		/>
	));
}

function Geometry({geometry, position, r, materials, soundEffects}) {
	const meshRef = useRef();
	const [visible, setVisible] = useState(false);

	const startingMaterial = getRandomMaterial();

	function getRandomMaterial() {
		return gsap.utils.random(materials);
	}

	function handleClick(e) {
		const mesh = e.object;

		gsap.utils.random(soundEffects).play();

		gsap.to(mesh.rotation, {
			x: `+=${gsap.utils.random(0, 2)}`,
			y: `+=${gsap.utils.random(0, 2)}`,
			z: `+=${gsap.utils.random(0, 2)}`,
			duration: 1.3,
			ease: 'elastic.out(1,0.3)',
			yoyo: true,
		});

		mesh.material = getRandomMaterial();
	}

	const handlePointerOver = () => {
		document.body.style.cursor = 'pointer';
	};

	const handlePointerOut = () => {
		document.body.style.cursor = 'default';
	};

	useEffect(() => {
		let ctx = gsap.context(() => {
			setVisible(true);
			gsap.from(meshRef.current.scale, {
				x: 0,
				y: 0,
				z: 0,
				duration: gsap.utils.random(0.8, 1.2),
				ease: 'elastic.out(1,0.3)',
				delay: gsap.utils.random(0, 0.5),
			});
		});
		return () => ctx.revert();
	}, []);

	return (
		<group position={position} ref={meshRef}>
			<Float
				speed={7 * r}
				rotationIntensity={7 * r}
				floatIntensity={7 * r}
			>
				<mesh
					geometry={geometry}
					onClick={handleClick}
					onPointerOver={handlePointerOver}
					onPointerOut={handlePointerOut}
					visible={visible}
					material={startingMaterial}
				></mesh>
			</Float>
		</group>
	);
}
