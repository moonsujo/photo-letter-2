import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

/**
 * Balloon class responsible for creating both the physics representation (Cannon.js)
 * and the visual representation (Three.js) of a balloon with a chain.
 */
export class Balloon {
    constructor({ world, scene, chainSize, chainDist, balloonRadius, balloonGravity, rootPosition }) {
        this.world = world;
        this.scene = scene;
        this.chainSize = chainSize || 9;
        this.chainDist = chainDist || 0.4;
        this.chainRadius = 0.05;
        this.balloonRadius = balloonRadius || 1.1;
        
        // Gravity force applied to the balloon (upward force)
        this.balloonGravity = balloonGravity || new CANNON.Vec3(0, 80, 0);
        // Scale gravity by radius/mass if needed (logic from original file)
        this.balloonGravity.y *= this.balloonRadius;

        this.rootPosition = rootPosition || new CANNON.Vec3(0, 0, 0);
        
        this.arraySpheres = []; // Visual meshes for the chain
        this.arrayBodys = [];   // Physics bodies for the chain
        this.material = undefined;
        this.loader = new GLTFLoader();

        this.init();
    }

    async init() {
        await this.initMaterials();
        await this.initPhysicsChain();
        await this.initPhysicsBalloon();
        await this.initVisualChain();
        await this.initVisualBalloon();
    }

    async initMaterials() {
        // Create a physics material
        this.material = new CANNON.Material('balloonMaterial');
    }

    /**
     * Initializes the physics bodies for the chain links.
     * Starts from the root (static or anchored) and builds upward.
     */
    async initPhysicsChain() {
        const radius = this.chainRadius;
        this.previousBody = undefined;

        for (let i = 0; i <= this.chainSize; i++) {
            const dist = this.chainDist;
            let mass = 0.2; // Mass of chain link
            
            // Calculate absolute position based on root
            // Chain index 0 is at root. 
            // Chain index 1 is at root + (0, dist, 0)
            // Stacking UPWARDS
            const offset = new CANNON.Vec3(0, i * dist, 0);
            let position = this.rootPosition.vadd(offset);

            // The first element is the anchor point
            if (i === 0) {
                mass = 0; // Static anchor
                position = this.rootPosition;
            }

            const shape = new CANNON.Sphere(radius);
            const body = new CANNON.Body({
                mass: mass,
                material: this.material,
                shape: shape
            });

            body.position.copy(position);
            
            // Reduced initial velocity and increased damping for stability
            body.velocity.x = 0; 
            
            body.linearDamping = 0.5; // Increased from 0.3
            body.angularDamping = 0.8; // Increased from 0.3 to stop spinning
            body.sleepSpeedLimit = 0.1;
            body.sleepTimeLimit = 1;

            this.world.addBody(body);
            this.arrayBodys.push({ bodySphere: body });

            if (this.previousBody) {
                // Connect current body to previous body with a constraint
                // Depending on the original 'wl' implementation, this is likely a DistanceConstraint or PointToPoint
                // Assuming PointToPoint for flexible chain or Distance for rigid link.
                // Using DistanceConstraint matches the physical "string" behavior well.
                const constraint = new CANNON.DistanceConstraint(
                    body,
                    this.previousBody,
                    dist
                );
                this.world.addConstraint(constraint);
            }

            this.previousBody = body;
        }
    }

    /**
     * Initializes the physics body for the balloon itself.
     */
    async initPhysicsBalloon() {
        const shape = new CANNON.Sphere(this.balloonRadius);
        this.balloonBody = new CANNON.Body({
            mass: this.balloonRadius, // Mass related to size
            material: this.material,
            shape: shape,
            linearDamping: 0.5,
            angularDamping: 0.5
        });
        
        // Initial position (will be pulled by constraint)
        // stack it on top of the last chain link
        const lastLinkOffset = new CANNON.Vec3(0, (this.chainSize + 1) * this.chainDist, 0); 
        this.balloonBody.position.copy(this.rootPosition.vadd(lastLinkOffset));
        
        this.world.addBody(this.balloonBody);

        // Connect balloon to the last link of the chain
        if (this.previousBody) {
             const constraint = new CANNON.DistanceConstraint(
                this.balloonBody, 
                this.previousBody, 
                this.balloonRadius // Distance from last link to balloon center
            );
            this.world.addConstraint(constraint);
        }
        
        // Add contact material for ground interaction if ground exists in world
        if (this.world.groundMaterial) {
            const mat = new CANNON.ContactMaterial(this.material, this.world.groundMaterial, {
                friction: 0.1,
                restitution: 0.9
            });
            this.world.addContactMaterial(mat);
        }
    }

    /**
     * Creates visual meshes for the chain links.
     * Note: You might want to use a line or a tube for better visuals, but spheres are good for debugging.
     */
    async initVisualChain() {
        const geometry = new THREE.SphereGeometry(this.chainRadius, 8, 8);
        const material = new THREE.MeshStandardMaterial({ color: 0x888888 });

        for (let i = 0; i < this.arrayBodys.length; i++) {
             const mesh = new THREE.Mesh(geometry, material);
             this.arrayBodys[i].sphere = mesh; // Store reference to visual mesh
             this.scene.add(mesh);
        }
    }

    /**
     * Loads the balloon model and adds it to the scene.
     */
    async initVisualBalloon() {
        // Provide the path to your GLB file
        const modelPath = './assets/balloon.glb'; 
        
        try {
            const gltf = await this.loader.loadAsync(modelPath);
            const originalGeometry = gltf.scene.children[0].geometry;
            
            // Randomly pick a color
            const colors = [0x8800ff, 0xff0000, 0xff00ff, 0x00ff00, 0xffff00];
            const color = colors[Math.floor(Math.random() * colors.length)];

            const material = new THREE.MeshStandardMaterial({
                color: color,
                roughness: 0.3,
                metalness: 0.1,
            });

            this.sphereBalloon = new THREE.Mesh(originalGeometry, material);
            this.sphereBalloon.castShadow = true;
            this.sphereBalloon.receiveShadow = true;
            
            // Initial position will be updated in loop
            this.scene.add(this.sphereBalloon);

        } catch (error) {
            console.warn('Could not load balloon model, using sphere fallback', error);
            const geometry = new THREE.SphereGeometry(this.balloonRadius, 32, 32);
            const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
            this.sphereBalloon = new THREE.Mesh(geometry, material);
            this.scene.add(this.sphereBalloon);
        }
    }

    /**
     * Update loop to sync physics transformation to visual meshes.
     * Call this every frame.
     */
    update() {
        // Sync Chain
        for (const item of this.arrayBodys) {
            if (item.sphere && item.bodySphere) {
                item.sphere.position.copy(item.bodySphere.position);
                item.sphere.quaternion.copy(item.bodySphere.quaternion);
            }
        }

        // Sync Balloon
        if (this.sphereBalloon && this.balloonBody) {
             // Apply upward force (Buoyancy / Helium)
             // We apply this every frame to simulate constant lift
             this.balloonBody.applyForce(this.balloonGravity, this.balloonBody.position);
             
             this.sphereBalloon.position.copy(this.balloonBody.position);
             this.sphereBalloon.quaternion.copy(this.balloonBody.quaternion);
             
             // LookAt logic from original to orient the balloon correctly?
             // original: n.sphereBalloon.matrix.lookAt(n.sphereBalloon.position, n.arrayBodys[8].sphere.position, new O(0,1,0))
             // This keeps the knot pointing down towards the string
             if (this.arrayBodys.length > 0) {
                 const lastLinkPos = this.arrayBodys[this.arrayBodys.length - 1].bodySphere.position;
                 this.sphereBalloon.lookAt(lastLinkPos);
                 // You might need to rotate it 90deg offset depending on the model's orientation
                 this.sphereBalloon.rotateX(-Math.PI / 2); 
             }
        }
    }

    /**
     * Releases the balloon from its anchor point by making the anchor dynamic.
     */
    release() {
        if (this.arrayBodys.length > 0) {
            const anchorBody = this.arrayBodys[0].bodySphere;
            // Changing from static (mass 0) to dynamic (mass > 0)
            if (anchorBody.type === CANNON.Body.STATIC || anchorBody.mass === 0) {
                anchorBody.mass = 0.1; // Same mass as other links
                anchorBody.type = CANNON.Body.DYNAMIC;
                anchorBody.updateMassProperties();
                
                // Optional: Wake up the body if it was sleeping
                anchorBody.wakeUp();
            }
        }
    }
}

/**
 * Manager to handle the physics world and multiple balloons.
 */
export class BalloonPhysicsManager {
    constructor(scene) {
        this.scene = scene;
        this.world = new CANNON.World();
        this.world.gravity.set(0, -50, 0); // Normal gravity affecting chain links
        this.world.broadphase = new CANNON.NaiveBroadphase();
        this.world.solver.iterations = 1;
        
        this.balloons = [];
        this.timeStep = 1 / 60;
    }

    createGround() {
        const groundShape = new CANNON.Plane();
        const groundMaterial = new CANNON.Material();
        const groundBody = new CANNON.Body({ mass: 0, material: groundMaterial });
        groundBody.addShape(groundShape);
        groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
        this.world.addBody(groundBody);
        this.world.groundMaterial = groundMaterial;
    }

    addBalloon(rootPosition) {
        const balloon = new Balloon({
            world: this.world,
            scene: this.scene,
            chainSize: 10,
            chainDist: 0.01,
            balloonRadius: 10.0,
            balloonGravity: new CANNON.Vec3(0, 1, 0), // Upward force
            rootPosition: rootPosition || new CANNON.Vec3(0, 0, 0)
        });
        this.balloons.push(balloon);
        return balloon;
    }

    update() {
        if (!this.world) return;
        
        // Step physics world
        this.world.step(this.timeStep);

        // Update all balloons
        this.balloons.forEach(balloon => balloon.update());
    }
}
