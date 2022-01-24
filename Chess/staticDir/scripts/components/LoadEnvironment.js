class LoadEnvironment {

    constructor (scene) {

        this.loader = new THREE.ColladaLoader();
        let chairModel;

        this.loadChairs();
        this.loadTable();
        this.loadCandle(40, 90, 600);
        this.loadCandle(40, 90, -600);
    }
    
    async loadCandle (x, y, z) {
        var geometry = new THREE.CylinderGeometry(5, 5, 20, 32);
        var material = new THREE.MeshPhongMaterial({
            color: 0xF9E5BC,
            specular: 0x202020,
            shininess: 40,
            polygonOffset: true,  
            polygonOffsetUnits: 1,
            polygonOffsetFactor: 1,
            shading: THREE.SmoothShading,
            // wireframe: true,
        });
        var candle1 = new THREE.Mesh(geometry, material);
        candle1.scale.set(6, 6, 6);
        candle1.position.set(x, y, z);
        candle1.rotation.set(0, 0, 0);

        scene.add(candle1);

        var geometry1 = new THREE.SphereGeometry(5, 10, 10, Math.PI/2, Math.PI*2, -Math.PI, Math.PI/2);
        var material1 = new THREE.MeshPhongMaterial({
            color: 0xF9E5BC,
            shininess: 10,
            side: THREE.DoubleSide,
            shading: THREE.SmoothShading,
            // wireframe: true,
        });
        var sphere = new THREE.Mesh(geometry1, material1);
        sphere.scale.set(10, 10, 10);
        sphere.position.set(x, y-40, z);
        sphere.rotation.set(0, 0, 0);

        scene.add(sphere);
    }

    async loadTable () {
        await this.loadModel("models/environment/Table.DAE",
                            { x: 20, y: 45, z: -33 }, // Position
                            { x: Math.PI / 2, y: 0, z: 0 }, // Rotation
                            { x: 100, y: 100, z: 100 }, // Scale
                            {
                                color: 0x222222,
                                specular: 0x303030,
                                shininess: 10,
                                polygonOffset: true,  
                                polygonOffsetUnits: 1,
                                polygonOffsetFactor: 1,
                                shading: THREE.FlatShading,
                                // wireframe: true,
                            }); 
        
    }

    async loadChairs () {
        await this.loadModel("models/environment/Chair.DAE",
                            { x: 700, y: -1200, z: 0 }, // Position
                            { x: 0, y: Math.PI, z: 0 }, // Rotation,
                            { x: 18, y: 18, z: 18 }, // Scale
                            {
                                color: 0xFF0000,
                                specular: 0x303030,
                                shininess: 10,
                                polygonOffset: true,  
                                polygonOffsetUnits: 1,
                                polygonOffsetFactor: 1,
                                shading: THREE.FlatShading,
                                // wireframe: true,
                            });

        await this.loadModel("models/environment/Chair.DAE",
                            { x: -700, y: -1200, z: 0 }, // Position
                            { x: 0, y: 0, z: 0 }, // Rotation,
                            { x: 18, y: 18, z: 18 }, // Scale
                            {
                                color: 0xFF0000,
                                specular: 0x303030,
                                shininess: 10,
                                polygonOffset: true,  
                                polygonOffsetUnits: 1,
                                polygonOffsetFactor: 1,
                                shading: THREE.FlatShading,
                                // wireframe: true,
                            });
    }

    loadModel (url, position, rotation, scale, mat) {
        return new Promise (resolve => {
            this.loader.load(url, function (collada) {
                let model = collada.scene;
                model.scale.set(scale.x, scale.y, scale.z);
                model.position.set(position.x, position.y, position.z);
                model.rotation.set(rotation.x, rotation.y, rotation.z);
                model.children[0].children[0].geometry.computeFaceNormals();
                model.children[0].children[0].geometry.computeVertexNormals(true);
                model.children[0].children[0].material = new THREE.MeshPhongMaterial(mat);
                
                scene.add(model);
                resolve(model);
            })
        })
    }

}