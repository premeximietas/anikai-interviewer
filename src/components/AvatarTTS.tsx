"use client";

import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";

interface AvatarProps extends React.ComponentPropsWithoutRef<'group'> {
    text: string; // TTS input text
}

const visemeMap: Record<string, string> = {
    "A:": "viseme_aa",//
    "e": "viseme_E",//
    "ih": "viseme_I",//
    "oh": "viseme_O",//
    "ou": "viseme_U",//
    "p": "viseme_PP", //
    "b": "viseme_PP",//
    "m": "viseme_PP",//
    "f": "viseme_FF",//
    "v": "viseme_FF",//
    "th": "viseme_TH",//
    "s": "viseme_SS",//
    "z": "viseme_SS",//
    "k": "viseme_kk",//
    "g": "viseme_kk",//
    "t": "viseme_DD",//
    "d": "viseme_DD",//
    "n": "viseme_nn",//
    "l": "viseme_nn",//
    "r": "viseme_RR",//
    "tS": "viseme_CH",//
    "dZ": "viseme_CH",//
    "S": "viseme_CH",//
};


export function AvatarTTS({ text, ...props }: AvatarProps) {
    const group = useRef<THREE.Group>(null);
    const speakingRef = useRef(false);
    const currentVisemeRef = useRef<string | null>(null);
    const morphTargetMap = useRef<Map<string, number>>(new Map());
    const speakingTimerRef = useRef<NodeJS.Timeout | null>(null);
    const errorRef = useRef(false);
    const blinkTimerRef = useRef<NodeJS.Timeout | null>(null);

    let nodes: any = null;
    let materials: any = null;

    try {
        const gltf = useGLTF("/models/67e2725e380f3de290fc7675.glb") as any;
        nodes = gltf.nodes;
        materials = gltf.materials;
    } catch (e) {
        console.error("Failed to load model:", JSON.stringify(e, null, 2));
        if (e instanceof Error) {
            console.error("Error message:", e.message);
            console.error("Error stack:", e.stack);
        } else {
            console.error("Unknown error:", e);
        }
        errorRef.current = true;                         
    }


    useEffect(() => {
        if (nodes?.Wolf3D_Head?.morphTargetDictionary) {
            const dict = nodes.Wolf3D_Head.morphTargetDictionary;
            const map = new Map<string, number>();

            Object.keys(dict).forEach((key) => {
                map.set(key, dict[key]);
            });

            morphTargetMap.current = map;
        }
    }, [nodes]);

    const getVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        const indianMaleVoice = voices.find(
            (voice) => voice.lang === "en-IN" && voice.name.toLowerCase().includes("male")
        );
        return indianMaleVoice || voices[0];
    };

    const resetMouth = () => {
        if (!nodes) return;

        const headInfluences = nodes?.Wolf3D_Head?.morphTargetInfluences ?? [];
        const teethInfluences = nodes?.Wolf3D_Teeth?.morphTargetInfluences ?? [];

        const dictionary = morphTargetMap.current;

        dictionary.forEach((index) => {
            if (headInfluences[index] !== undefined) {
                headInfluences[index] = 0;
            }
            if (teethInfluences[index] !== undefined) {
                teethInfluences[index] = 0;
            }
        });

        currentVisemeRef.current = null;
    };

    const speak = useCallback(() => {
        if (!text) return;

        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = getVoice();
        utterance.pitch = 1;
        utterance.rate = 1;

        utterance.onstart = () => {
            speakingRef.current = true;
        };

        utterance.onend = () => {
            speakingRef.current = false;
            currentVisemeRef.current = null;

            if (speakingTimerRef.current) {
                clearInterval(speakingTimerRef.current);
                speakingTimerRef.current = null;
            }
            resetMouth();
        };
        synth.speak(utterance);

        // ✅ Improved phoneme syncing
        const phonemes = text.toLowerCase().split("");
        let index = 0;

        speakingTimerRef.current = setInterval(() => {
            if (index >= phonemes.length) {
                clearInterval(speakingTimerRef.current!);
                currentVisemeRef.current = null;
                return;
            }

            const phoneme = phonemes[index];
            currentVisemeRef.current = visemeMap[phoneme] || "viseme_sil"; // Default to closed mouth
            index++;
        }, 250);


    }, [text]);

    useEffect(() => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length === 0) {
            window.speechSynthesis.onvoiceschanged = () => {
                speak();
            };
        } else {
            speak();
        }

        return () => {
            if (speakingTimerRef.current) {
                clearInterval(speakingTimerRef.current);
            }
        };
    }, [text, speak]);

    useFrame((state,delta) => {
        if (!speakingRef.current || !currentVisemeRef.current || !nodes) return;

        const headInfluences = nodes?.Wolf3D_Head?.morphTargetInfluences ?? [];
        const teethInfluences = nodes?.Wolf3D_Teeth?.morphTargetInfluences ?? [];

        const dictionary = morphTargetMap.current;

        // Reset all morph targets
        dictionary.forEach((index) => {
            if (headInfluences[index] !== undefined) {
                headInfluences[index] = 0;
            }
            if (teethInfluences[index] !== undefined) {
                teethInfluences[index] = 0;
            }
        });

        // Apply current viseme
        const visemeIndex = dictionary.get(currentVisemeRef.current ?? "");
        if (visemeIndex !== undefined) {
            if (headInfluences[visemeIndex] !== undefined) {
                headInfluences[visemeIndex] = 1;
            }
            if (teethInfluences[visemeIndex] !== undefined) {
                teethInfluences[visemeIndex] = 1;
            }
        }

        if (!speakingRef.current) {
            resetMouth();
        }
    });


    useFrame((state) => {
        if (group.current) {
            group.current.getObjectByName("Head")?.lookAt(state.camera.position);
        }
    });

    if (errorRef.current) {
        return <p>Failed to load model.</p>;
    }
    console.log({ nodes, materials })
    return (
        <group {...props} dispose={null} ref={group}>
            {nodes ? (
                <>
                    <primitive object={nodes?.Hips} />
                    <skinnedMesh
                        geometry={nodes?.Wolf3D_Body?.geometry}
                        material={materials?.Wolf3D_Body}
                        skeleton={nodes?.Wolf3D_Body?.skeleton}
                    />
                    <skinnedMesh
                        geometry={nodes?.Wolf3D_Outfit_Top?.geometry}
                        material={materials?.Wolf3D_Outfit_Top}
                        skeleton={nodes?.Wolf3D_Outfit_Top?.skeleton}
                    />
                    <skinnedMesh
                        geometry={nodes?.Wolf3D_Hair?.geometry}
                        material={materials?.Wolf3D_Hair}
                        skeleton={nodes?.Wolf3D_Hair?.skeleton}
                    />
                    <skinnedMesh
                        name="Wolf3D_Head"
                        geometry={nodes.Wolf3D_Head.geometry}
                        material={materials.Wolf3D_Skin}
                        skeleton={nodes.Wolf3D_Head.skeleton}
                        morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary}
                        morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences}
                    />

                    <skinnedMesh
                        name="Wolf3D_Teeth"
                        geometry={nodes.Wolf3D_Teeth.geometry}
                        material={materials.Wolf3D_Teeth}
                        skeleton={nodes.Wolf3D_Teeth.skeleton}
                        morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary}
                        morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences}
                    />

                    <skinnedMesh
                        name="EyeLeft"
                        geometry={nodes.EyeLeft.geometry}
                        material={materials.Wolf3D_Eye}
                        skeleton={nodes.EyeLeft.skeleton}
                        morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary}
                        morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences}
                    />
                    <skinnedMesh
                        name="EyeRight"
                        geometry={nodes.EyeRight.geometry}
                        material={materials.Wolf3D_Eye}
                        skeleton={nodes.EyeRight.skeleton}
                        morphTargetDictionary={nodes.EyeRight.morphTargetDictionary}
                        morphTargetInfluences={nodes.EyeRight.morphTargetInfluences}
                    />

                </>
            ) : (
                <></>
            )}
        </group>
    );
}

useGLTF.preload("/models/67e2725e380f3de290fc7675.glb");
