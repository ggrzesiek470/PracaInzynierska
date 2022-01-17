function Main() {
    var gameEnabled = false;
    var nickLogged;
    var wins;
    var draws;
    var losses;
    var points;
    var arrowHelpers = [];
    var gameModeInit;

    this.setStatistics = function (Wins, Draws, Losses, Points) {
        wins = Wins;
        draws = Draws;
        losses = Losses;
        points = Points;
    }

    this.getStatistics = function () {
        object = {
            wins: wins,
            draws: draws,
            losses: losses,
            points: points,
        }
        return object;
    }

    var szachownica =
    [
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    ];
    var pola_tab = [];
    for (let i = 0; i < 8; i++) { // generates 8x8 array
        pola_tab.push([]);
        for (let j = 0; j < 8; j++) {
            pola_tab[i].push('');
        }
    }
    var orbitControl;
    var ognie = [];

    var canvas;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight);

    this.getNick = function () {
        return nickLogged;
    }

    this.changeColorOfPlace = function (x, y, color) {
        pola_tab[x][y].material = new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, color: color, shininess: 60, });
    }

    this.clearColors = function () {
        for (var w = 0; w < szachownica.length; w++) {
            for (var k = 0; k < szachownica[0].length; k++) {
                if (szachownica[w][k] == 1) {
                    pola_tab[w][k].material = new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, color: "#624a2e", shininess: 60, });
                }
                else {
                    pola_tab[w][k].material = new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, color: 0xffffff, shininess: 60, });
                }
            }
        }
    }

    this.moveFigure = function (x, y, xDes, yDes, shouldGoUp = true, addArrow = false, time = 500) {
        return new Promise(resolve => {
            for (var i = 0; i < scene.children.length; i++) {
                let pawn3dObject = scene.children[i];
                if (pawn3dObject.pawnData != undefined
                    && pawn3dObject.pawnData.position.x == x
                    && pawn3dObject.pawnData.position.y == y) {
                        let startTime = new Date();
                        pawn3dObject.pawnData.position.x = xDes;
                        pawn3dObject.pawnData.position.y = yDes;
    
                        let priorPos = pola_tab[x - 1][y - 1].position;
                        let priorXPos = priorPos.x;
                        let priorZPos = priorPos.z;
    
                        let nextPos = pola_tab[xDes - 1][yDes - 1].position;
                        let nextXPos = nextPos.x;
                        let nextZPos = nextPos.z;

                        let percentOfMove = 0;
                        let currentXPos = priorXPos;
                        let currentYPos = 10;
                        let currentZPos = priorZPos;

                        let goingUp = shouldGoUp;
    
                        let intervalMove = setInterval(() => {
                            let currentTime = new Date();
                            if (goingUp == true) {
                                percentOfMove = Math.min((currentTime - startTime) / time, 1);
                                currentYPos = 10 + 170*percentOfMove;

                                pawn3dObject.position.set(currentXPos, currentYPos, currentZPos);

                                if (percentOfMove >= 1) {
                                    startTime = new Date();
                                    goingUp = false;
                                }
                            } else if (goingUp == false) {
                                percentOfMove = Math.min((currentTime - startTime) / time, 1);
        
                                currentXPos = priorXPos + (nextXPos - priorXPos)*percentOfMove;
                                currentYPos = shouldGoUp ? 180 : 10;
                                currentZPos = priorZPos + (nextZPos - priorZPos)*percentOfMove;
        
                                pawn3dObject.position.set(currentXPos, currentYPos, currentZPos);
        
                                if (percentOfMove >= 1) {
                                    if (shouldGoUp == true) {
                                        percentOfMove = Math.min((currentTime - startTime) / time, 2);
                                        currentYPos = shouldGoUp ? 180 - 170*(percentOfMove - 1) : 10;

                                        pawn3dObject.position.set(currentXPos, currentYPos, currentZPos);
                                        if (percentOfMove >= 2) {
                                            clearInterval(intervalMove);
                                            main.removeAllArrows();
                                            main.addArrow(priorXPos, priorZPos, nextXPos, nextZPos);
                                            resolve();
                                        }
                                    } else {
                                        clearInterval(intervalMove);
                                        main.removeAllArrows();
                                        main.addArrow(priorXPos, priorZPos, nextXPos, nextZPos);
                                        resolve();
                                    }
                                }
                            }
                        }, 20);
                }
            }
        });
    }

    this.removeAllArrows = function () {
        arrowHelpers.forEach(arrow => {
            scene.remove(arrow);
        });
    }

    this.addArrow = function (x, z, xDes, zDes) {
        const dir = new THREE.Vector3( xDes-x, 15, zDes-z );
        const origin = new THREE.Vector3( x, 15, z );
        dir.normalize();

        const length = Math.sqrt(Math.pow(xDes - x, 2) + Math.pow(zDes - z, 2));
        const hex = "rgb(244, 81, 30)";

        const arrowHelper = new THREE.ArrowHelper( dir, origin, length, hex );
        scene.add(arrowHelper);
        arrowHelpers.push(arrowHelper);

        return arrowHelper;
    }

    this.deletePawn = function (x, y) {
        for (var i = 0; i < scene.children.length; i++) {
            if (scene.children[i].pawnData != undefined) {
                if (scene.children[i].pawnData.position.x == x && scene.children[i].pawnData.position.y == y) {
                    // console.log("usuniety");
                    scene.remove(scene.children[i]);
                    game.getLocalTable[y - 1, x - 1];
                    return true;
                }
            }
        }
        return false;
    }
	
	this.changeModel = function (x, y, type) {
        for (var i = 0; i < scene.children.length; i++) {
            if (scene.children[i].pawnData != undefined) {
                if (scene.children[i].pawnData.position.x == x && scene.children[i].pawnData.position.y == y) {
					// console.log ("zamiana modelu pionka");
                    scene.remove(scene.children[i]);
					var model = new Piece(game.getLocalTable()[y - 1][x - 1].type);
                    model.name = game.getLocalTable()[y - 1][x - 1].type + (y-1).toString() + (x-1).toString();
                    model.pawnData = { position: { x: game.getLocalTable()[y - 1][x - 1].position.x, y: game.getLocalTable()[y - 1][x - 1].position.y, }, type: game.getLocalTable()[y - 1][x - 1].type, color: game.getLocalTable()[y - 1][x - 1].color };

                    model.loadModel(game.getLocalTable()[y - 1][x - 1].src, function (modelData) {
						modelData.children[0].children[0].geometry.computeFaceNormals();              
						modelData.children[0].children[0].geometry.mergeVertices();
						modelData.children[0].children[0].geometry.computeVertexNormals();
							
                        modelData.children[0].children[0].material = new THREE.MeshPhongMaterial({
                            color: game.getLocalTable()[y - 1][x - 1].color == "black" ? "#322a1e" : 0xEEEEEE,
							specular: 0x303030,
                            shininess: 10,
							polygonOffset: true,  
							polygonOffsetUnits: 1,
							polygonOffsetFactor: 1,
							shading: THREE.SmoothShading,
                            // wireframe: true,
                        });
                        modelData.position.set(pola_tab[modelData.pawnData.position.x - 1][modelData.pawnData.position.y - 1].position.x, 10, pola_tab[modelData.pawnData.position.x - 1][modelData.pawnData.position.y - 1].position.z);
                        scene.add(modelData);
                    })
                }
            }
        }
	}

    function createLight(x, y, z, lightColor, fireColorsArray, distance, intensity, visibility) {
        var fire = new Fireplace(lightColor, fireColorsArray, distance, intensity);
        fire.generateFireplace(x, y, z);
        if (visibility == false) fire.makeInvisible();
        ognie.push(fire);
    }

    function createChessboard() {
        var y = -350;
        var w = 0;

        for (var i = 0; i < 8; i++) {
            var k = 0;
            var x = -350;
            for (var j = 0; j < 8; j++) {
                var geometry = new THREE.BoxGeometry(100, 100, 20);

                if (szachownica[w][k] == 1) {
                    var material = new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, color: "#624a2e", shininess: 60, });
                    var nazwa = 'sc' + i + j + '';
                }
                else {
                    var material = new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, color: 0xFFFFFF, shininess: 60, });
                    var nazwa = 'sb' + i + j + '';
                }

                podloga = new THREE.Mesh(geometry, material);
                scene.add(podloga);
                podloga.position.set(x, 0, y);
                podloga.rotation.x = Math.PI / 2;
                podloga.name = nazwa;
                pola_tab[i][j] = podloga;
                x += 100;
                k++;
            }
            y += 100;
            w += 1;
        }

        loadCorners();
        let env = new LoadEnvironment(scene);
    }

    this.createFigures = function () { createFigures(); }

    function createFigures() {
        var loadingScreen = new LoadingScreen(32);
        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 8; j++) {
                if (game.getLocalTable()[i][j] != 0) {
                    const colorOfPlayer = game.getLocalTable()[i][j].color;
                    let colorHex = (colorOfPlayer == "black") ? "#322a1e" : 0xEEEEEE;

                    if (colorOfPlayer == "black" || colorOfPlayer == "white") {
                        var model = new Piece(game.getLocalTable()[i][j].type);
                        model.name = game.getLocalTable()[i][j].type + i.toString() + j.toString();
                        model.pawnData = {
                            position: {
                                x: game.getLocalTable()[i][j].position.x,
                                y: game.getLocalTable()[i][j].position.y,
                            },
                            type: game.getLocalTable()[i][j].type,
                            color: game.getLocalTable()[i][j].color
                        };

                        model.loadModel(game.getLocalTable()[i][j].src, function (modelData) {
                            let mainMesh = modelData.children[0].children[0];
                            let position = {
                                x: modelData.pawnData.position.x,
                                y: modelData.pawnData.position.y
                            }
                            
                            mainMesh.geometry.computeFaceNormals();
                            mainMesh.geometry.mergeVertices();
                            mainMesh.geometry.computeVertexNormals();
                            mainMesh.material = new THREE.MeshPhongMaterial({
                                color: colorHex,
                                specular: 0x303030,
                                shininess: 10,
                                polygonOffset: true,
                                polygonOffsetUnits: 1,
                                polygonOffsetFactor: 1,
                                shading: THREE.SmoothShading,
                            });
                            if (colorOfPlayer == "white") {
                                modelData.rotation.y = Math.PI * 180 / 180;
                            }
                            if (modelData.pawnData.type == "King") {
                                modelData.rotation.y = (colorOfPlayer == "black") ? (90 * Math.PI / 180) : ((-90) * Math.PI / 180);
                            }

                            modelData.position.set(
                                pola_tab[position.x - 1][position.y - 1].position.x,
                                10,
                                pola_tab[position.x - 1][position.y - 1].position.z
                            );
                            scene.add(modelData);
                            game.loadingFigures += 1;
                            loadingScreen.addOneToVal();
                        })
                    }
                };
            }
        }
    }

    function loadCorners () {
        var letters = ["A", "B", "C", "D", "E", "F", "G", "H"];
        var numbers = ["1", "2", "3", "4", "5", "6", "7", "8"];
        const loader = new THREE.FontLoader();

        var x = -370;
        var z = -460;

        numbers.forEach(n => {
            new PositionText(loader, scene, n, { x: x, y: 0, z: z }, "white");
            x += 100;
        });

        x = -470;
        z = -360;

        letters.forEach(l => {
            new PositionText(loader, scene, l, { x: x, y: 0, z: z }, "white");
            z += 100;
        });

        x = 350;
        z = 460;

        numbers.sort(function(a, b){return b-a});

        numbers.forEach(n => {
            new PositionText(loader, scene, n, { x: x, y: 0, z: z }, "black");
            x -= 100;
        });

        x = 460;
        z = -330;

        letters.forEach(l => {
            new PositionText(loader, scene, l, { x: x, y: 0, z: z }, "black");
            z += 100;
        });
    }

    this.setCameraPosition = function (x, y, z) {
        camera.position.set(x, y, z);
        camera.lookAt(new THREE.Vector3());
    }

    function deletePawns() {
        for (var i = 0; i < scene.children.length; i++) {
            if (scene.children[i].pawnData != undefined) {
                scene.remove(scene.children[i]);
            }
        }
    }

    function init() {
        var renderer = new THREE.WebGLRenderer({ antialias: true, });
        renderer.setPixelRatio(2);

        orbitControl = new THREE.OrbitControls(camera, renderer.domElement);
        orbitControl.addEventListener('change', function () {
            renderer.render(scene, camera)
        });

        var s = window.getComputedStyle(document.getElementById("view"));
        var h = parseInt(s.getPropertyValue("height"));
        var w = parseInt(s.getPropertyValue("width"));
        renderer.setClearColor(0x002244);
        renderer.setSize(w, h);
        document.getElementById("view").appendChild(renderer.domElement);

        camera.position.set(0, 600, -600);
        camera.lookAt(new THREE.Vector3());

        let fireColorsArray = [0xe25822, 0xfbb741, 0xc2261f, 0xfda50f, 0xcc7722, 0x883000];

        createChessboard();
        createLight(120, 300, 708, "#eeaa66", fireColorsArray, 300, 2, false);
        createLight(120, 70, 592, "#eeaa66", fireColorsArray, 300, 2, false);
        createLight(-120, 70, 592, "#eeaa66", fireColorsArray, 300, 2, false);
        createLight(45, 150, 608, "#eeaa66", fireColorsArray, 300, 0.25, true);
        createLight(45, 150, -592, "#eeaa66", fireColorsArray, 300, 0.25, true);
        createLight(120, 300, -708, "#eeaa66", fireColorsArray, 300, 2, false);
        createLight(120, 70, -492, "#eeaa66", fireColorsArray, 300, 2, false);
        createLight(-120, 70, -492, "#eeaa66", fireColorsArray, 300, 2, false);
        createLight(-600, 100, 50, "#eeeeee", fireColorsArray, 300, 1.5, false);
        createLight(600, 100, 50, "#eeeeee", fireColorsArray, 300, 1.5, false);
        createLight(0, 300, 0, "#eeeeee", fireColorsArray, 300, 1.25, false);
        // createFigures();

        function animateScene() {
            requestAnimationFrame(animateScene);
            renderer.render(scene, camera);

            var s = window.getComputedStyle(document.getElementById("view"));
            var h = parseInt(s.getPropertyValue("height"));
            var w = parseInt(s.getPropertyValue("width"));

            renderer.setSize(w, h);

            for(var i = 0; i < ognie.length; i++) {
                ognie[i].update();
            } 

            camera.updateProjectionMatrix();

            if (canvas != undefined) canvas.canvasUpdate(nickLogged, wins, draws, losses, points);
        }

        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        animateScene();
        camera.lookAt(scene.position);

        document.addEventListener("mousedown", onMouseDown, false);
        function onMouseDown(e) {
            if (e.target.tagName == "CANVAS" && game.isGameEnabled()) {
				if (e.button == 0) {
					var raycaster = new THREE.Raycaster();
					var mouseVector = new THREE.Vector2();

					mouseVector.x = (e.clientX / (window.innerWidth)) * 2 - 1;
					mouseVector.y = -(e.clientY / window.innerHeight) * 2 + 1;

					raycaster.setFromCamera(mouseVector, camera);

					intersects = raycaster.intersectObjects(scene.children, true);

					if (intersects[0] != undefined) {
						// console.log(intersects[0]);
						if (intersects[0].object.parent.parent != undefined) {
							if (intersects[0].object.parent.parent.pawnData != undefined) {
								var pos = intersects[0].object.parent.parent.pawnData.position;
								game.placeClicked(pos.x, pos.y);
							}
						} else {
							if (intersects[0].object.name[0] == 's') {
								var idd = intersects[0].object.name;
								var x = parseInt(idd[2]) + 1;
								var y = parseInt(idd[3]) + 1;
								game.placeClicked(x, y);
							}
						}
					}
				}
			}
        }
    }

    document.getElementById("rejestruj").addEventListener("click", function () {
        if (document.getElementById("user_reg").value != "") {
            if (document.getElementById("pass_reg").value != "") {
                net.getForRegister();
            } else {
                net.window.showWindow("Wpisz hasło!");
            }
        } else {
            net.window.showWindow("Wpisz nick!");
        }
    })

    document.getElementById("loguj").addEventListener("click", function () {
        if (document.getElementById("user_log").value != "") {
            if (document.getElementById("pass_log").value != "") {
                net.login(document.getElementById("user_log").value, document.getElementById("pass_log").value);
            } else {
                net.window.showWindow("Wpisz hasło!");
            }
        } else {
            net.window.showWindow("Wpisz nick!");
        }
    })

    this.zalogowano = function (nick) {
        nickLogged = nick;
        $("#pass_log").css("display", "none");
        $("#user_log").css("display", "none");
        $("#pass_reg").css("display", "none");
        $("#user_reg").css("display", "none");
        $("#loguj").css("display", "none");
        $("#rejestruj").css("display", "none");
        $("#szukajGracza").css("display", "initial");

        canvas = new Canvas(0, 0);
        document.body.appendChild(canvas.canvas());

        gameModeInit = new GameModeInit();

        $("#szukajGracza").on("click", () => {
            gameModeInit.show();
            $("#szukajGracza").css("display", "none");
        });
    }

    init();
}