import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber';

const Earth = (props) => {
    const { nodes, materials } = useGLTF('/models/earth.glb');
    const { enabled } = props;
    const ref = useRef();

    useFrame(() => {
        ref.current.rotation.x += 0.001;
        ref.current.rotation.y += 0.001;
        ref.current.rotation.z += 0.001;

        if (!enabled && ref.current.scale.x >= 0.95) {
            ref.current.scale.x -= 0.0025;
            ref.current.scale.y -= 0.0025;
            ref.current.scale.z -= 0.0025;
        } else if (enabled && ref.current.scale.x <= 0.99) {
            ref.current.scale.x += 0.0025;
            ref.current.scale.y += 0.0025;
            ref.current.scale.z += 0.0025;
        }
    })

    return (
        <group {...props} dispose={null} ref={ref}>
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Object_4.geometry}
                material={materials['Scene_-_Root']}
                scale={1.128}
            />
        </group>
    )
}

useGLTF.preload('/models/earth.glb')
export default Earth;