import * as THREE from 'three';
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); 

const rayscaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

let intersectObject = "";
const intersectObjects = [];
const intersectObjectsNames = [
    "proj1",
    "proj2",
    "proj3",
    "skills",
    "boots",
    "Picnic",
  "Squirtle",
  "Chicken",
  "Pikachu",
  "Bulbasaur",
  "Charmander",
  "Snorlax",
  "Chest",

];

let boots = {
    instance: null,
    moveDisance: 7,
    jumpHeight: 1,
    isMoving: false,
    moveDuration: 0.2,
}

const modalContent={
    "proj1": {
        title: "The CarePal",
        description: "A web application designed to help caregivers manage their tasks and communicate with patients. The CarePal provides a user-friendly interface for scheduling appointments, tracking medication, and sharing important information between caregivers and patients. the goal of The CarePal is to improve the quality of care for patients while also making the lives of caregivers easier and more efficient.",
        link: "http://www.thecarepal.com",
    },
    "proj2": {
        title: "SoftMonk",
        description: "A web application designed to help soft developers manage their tasks and communicate with clients, while providing digital tech solutions through apps, software, and chatbots.",
        link: "http://www.thesoftmonk.com",
    },
    "proj3": {
        title: "3D Web Portfolio",
        description: "A 3D interactive web portfolio built using Three.js, showcasing my projects and skills in a unique and engaging way. Explore my work in a dynamic 3D environment and discover my creative journey. it have a lot of easter eggs 🥚👀. do find them! and check out the links!",
        link: "http://www.google.com",
    },
    "skills": {
        title: "Skills",
        description: "This is the description of skills."
    },
     "Chest": {
    title: "💁 About Me",
    content:
      "Hi you found my chest👋, I'm Vinayak and I am an aspiring creative developer. I just started web development ! In the signs, you will see some of my most recent projects that I'm proud of. I hope to add a lot more in the future. In my free time, I like to draw, watch standups (especially Anime), do a bit of everything. Reach out if you wanna chat.",
  },
  "Picnic": {
    title: "Party Vibes",
    content:
      "i love to party! and this is a picnic party with my friends, we had so much fun and we danced all night long. it was a memorable night and i hope to have more parties like this in the future. we also had partied hard in our hostels and made a lot of noise, but it was worth it! the memories we made will last a lifetime.",
  },
}
const modal = document.querySelector(".modal");
const modalTitle = document.querySelector(".modal-title");
const modalDescription = document.querySelector(".modal-project-description");
const modalExitBtn = document.querySelector(".modal-exit-button");
const modalVisitProjectBtn = document.querySelector(".modal-project-visit-button");

function showModal(id) {
    const content = modalContent[id];
    if (content && modal && modalTitle && modalDescription) {
        modalTitle.textContent = content.title;
        modalDescription.textContent = content.description;

        if (content.link && modalVisitProjectBtn) {
            modalVisitProjectBtn.href = content.link;
            modalVisitProjectBtn.classList.remove("hidden");
        } else if (modalVisitProjectBtn) {
            modalVisitProjectBtn.classList.add("hidden");
        }
        modal.classList.toggle("hidden");
    }
}

function hideModal() {
    if (modal) {
        modal.classList.toggle("hidden");
    }
}

const mobileControls = {
    up: document.querySelector(".mobile-control.up-arrow"),
    down: document.querySelector(".mobile-control.down-arrow"),
    left: document.querySelector(".mobile-control.left-arrow"),
    right: document.querySelector(".mobile-control.right-arrow"),
};

const pressedButtons = {
    up: false,
    down: false,
    left: false,
    right: false,
};

function clearPressedButtons() {
    Object.keys(pressedButtons).forEach((key) => {
        pressedButtons[key] = false;
    });
}

function onTouchEnd(event) {
    event.preventDefault();
    clearPressedButtons();
}

function onKeyUp(event) {
    const key = event.key.toLowerCase();
    if (["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(key)) {
        clearPressedButtons();
    }
}

const canvas = document.getElementById('experience-canvas');
const size = {
    width: window.innerWidth,
    height: window.innerHeight
};

// getting all the data through cdn using threejs WebGLRenderer and appending it to the body of the document
//where .setSize is a function insdie the WebGLRenderer class which sets the size of the renderer to the width and height of the window
//also the renderer.domElement is the canvas element that the renderer uses to display the scene and we are appending it to the body of the document so that it can be visible on the webpage

const renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
renderer.setSize( size.width, size.height );
renderer.setPixelRatio( Math.min( window.devicePixelRatio, 2 ) );
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.shadowMap.enabled = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.75;
// document.body.appendChild( renderer.domElement );


const loader = new GLTFLoader();

loader.load( './VinayakPortThree.glb', function ( glb ) {
    glb.scene.traverse( ( child ) => {
        if( intersectObjectsNames.includes( child.name ) ) {
            intersectObjects.push( child );
        }
        if ( child.isMesh ) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
        if ( child.name === "boots" ) {
            boots.instance = child;
        }
    } );
    scene.add( glb.scene );

}, undefined, function ( error ) {

  console.error( error );

} );


const sun = new THREE.DirectionalLight( 0xFFFFFF );
sun.castShadow = true;
sun.position.set( 95, 90, 0 );
sun.target.position.set( 60, 20, 0 );
sun.shadow.mapSize.width = 4096;
sun.shadow.mapSize.height = 4096;
sun.shadow.camera.left = -150;
sun.shadow.camera.right = 150;
sun.shadow.camera.top = 150;
sun.shadow.camera.bottom = -150;
sun.shadow.normalBias = 0.9;
scene.add( sun );

const shadowHelper = new THREE.CameraHelper( sun.shadow.camera );
scene.add( shadowHelper );
const helper = new THREE.DirectionalLightHelper( sun, 5 );
scene.add( helper );


const light = new THREE.AmbientLight( 0x404040 ,3 ); // soft white light
scene.add( light );


const camera = new THREE.PerspectiveCamera( 75, size.width / size.height, 0.1, 1000 );

// camera.position.x = -67
// camera.position.y = 15;
// camera.position.z = -92;

// const cameraOffset = new THREE.Vector3( -12, 12, -50 );
// camera.zoom = 2;
// camera.updateProjectionMatrix();
// const controls = new OrbitControls( camera, canvas );
// controls.update();




camera.position.x = -13;
camera.position.y = 39;
camera.position.z = -67;

const cameraOffset = new THREE.Vector3(-13, 39, -67);

camera.zoom = 1.8;
camera.updateProjectionMatrix();

// const controls = new OrbitControls(camera, canvas);
// controls.update();




function onHandleResize() {
    size.width = window.innerWidth;
    size.height = window.innerHeight;
    camera.aspect = size.width / size.height;
    camera.updateProjectionMatrix();


    renderer.setSize( size.width, size.height );
    renderer.setPixelRatio( Math.min( window.devicePixelRatio, 2 ) );


    
}

function onClick( event ) {
    // console.log(intersectObject);
    if(intersectObject){
        showModal(intersectObject);
    }
    
}

function onPointerMove( event ) {
    pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

function moveBoots(targetPosition, targetRotation) {
    boots.isMoving = true;
    
    const t1  = gsap.timeline({
        onComplete: () => {
            boots.isMoving = false;
        }
    })

    t1.to(boots.instance.position, {
        x: targetPosition.x,
        z: targetPosition.z,
        duration: boots.moveDuration,
    });

    t1.to(boots.instance.rotation, {
        y: targetRotation,
        duration: boots.moveDuration,
    }, 0);
    t1.to(boots.instance.position, {
        y: boots.instance.position.y + boots.jumpHeight,
        duration: boots.moveDuration / 2,
        yoyo: true,
        repeat: 1,
    }, 0);

}

function onKeyDown( event ) {
    if(boots.isMoving) return;

    const targetPosition = new THREE.Vector3().copy(boots.instance.position);
    let targetRotation = 0;
    switch (event.key.toLowerCase()) {
        case "w":
        case "arrowup":   
            targetPosition.z += boots.moveDisance; 
            targetRotation = Math.PI;
            break;
        case "s":
        case "arrowdown":   
            targetPosition.z -= boots.moveDisance; 
            targetRotation = 0;
            break;
        case "a":
        case "arrowleft":   
            targetPosition.x += boots.moveDisance; 
            targetRotation = -Math.PI/2;
            break;
        case "d":
        case "arrowright":   
            targetPosition.x -= boots.moveDisance; 
            targetRotation = Math.PI/2;
            break;
    
        default:
            break;

    }
    moveBoots(targetPosition, targetRotation);

}




Object.entries(mobileControls).forEach(([direction, element]) => {
    if (!element) return;

    ["touchstart", "mousedown"].forEach((eventName) => {
        element.addEventListener(eventName, (e) => {
            e.preventDefault();
            pressedButtons[direction] = true;
        }, { passive: false });
    });

    ["touchend", "mouseup", "mouseleave", "touchcancel"].forEach((eventName) => {
        element.addEventListener(eventName, (e) => {
            if (e && e.preventDefault) {
                e.preventDefault();
            }
            pressedButtons[direction] = false;
        }, { passive: false });
    });
});

modalExitBtn.addEventListener("click", hideModal );
window.addEventListener( 'resize', onHandleResize );
window.addEventListener( 'click', onClick );
window.addEventListener( 'pointermove', onPointerMove );
window.addEventListener( 'keydown', onKeyDown );
window.addEventListener( 'keyup', onKeyUp );
window.addEventListener("touchend", onTouchEnd, { passive: false });



function animate( ) {
// to get the camera position in the console log to check if it is changing or not when we move the mouse
// console.log(camera.position);

if(boots.instance) {
    camera.position.copy(boots.instance.position).add( cameraOffset );
    camera.lookAt(boots.instance.position);

    if (!boots.isMoving) {
        const targetPosition = new THREE.Vector3().copy(boots.instance.position);
        let targetRotation = null;

        if (pressedButtons.up) {
            targetPosition.z += boots.moveDisance;
            targetRotation = Math.PI;
        } else if (pressedButtons.down) {
            targetPosition.z -= boots.moveDisance;
            targetRotation = 0;
        } else if (pressedButtons.left) {
            targetPosition.x += boots.moveDisance;
            targetRotation = -Math.PI / 2;
        } else if (pressedButtons.right) {
            targetPosition.x -= boots.moveDisance;
            targetRotation = Math.PI / 2;
        }

        if (targetRotation !== null) {
            moveBoots(targetPosition, targetRotation);
        }
    }
}

rayscaster.setFromCamera( pointer, camera );
const intersects = rayscaster.intersectObjects( intersectObjects );

if( intersects.length > 0 ) {
    document.body.style.cursor = 'pointer';
} else {
    document.body.style.cursor = 'default';
    intersectObject = "";
};
for ( let i = 0; i < intersects.length; i++ ) {
    // console.log(intersects[0].object.parent.name);
    intersectObject = intersects[0].object.parent.name;
}
  renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );