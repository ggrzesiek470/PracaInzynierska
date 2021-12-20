function PositionText (loader, scene, text, position, color) {
    this.init = () => {
        loader.load( 'gfx/fonts/Bodoni MT_Regular.json', function ( font ) {
            const geometry = new THREE.TextGeometry( text, {
                font: font,
                size: 50,
                height: 5,
                curveSegments: 4,
                bevelEnabled: true,
                bevelThickness: 5,
                bevelSize: 3,
                bevelOffset: 0,
                bevelSegments: 3
            } );


            const materialForText = new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, color: { color: 0xffffff }, shininess: 60, });
            const mesh = new THREE.Mesh( geometry, materialForText );
            mesh.position.x = position.x;
            mesh.position.y = position.y;
            mesh.position.z = position.z;

            mesh.rotation.x = (-1) * Math.PI / 2;
            if (color == "white") {
                mesh.rotation.z = (-1) * Math.PI / 2;
            } else {
                mesh.rotation.z = Math.PI / 2;
            }
            scene.add(mesh);
        } );


    }

    this.init();
    
}