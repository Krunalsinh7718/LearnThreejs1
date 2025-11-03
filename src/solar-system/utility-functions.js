import * as THREE from 'three';


function createSphere(radius, meshMaterial, position) {
    const geometry = new THREE.SphereGeometry(radius, 100, 100);
    const material = new THREE.MeshStandardMaterial(meshMaterial);
    const sphere = new THREE.Mesh(geometry, material);
    if (position) {
        sphere.position.set(position.x, position.y, position.z);
    }
    return sphere;
}


function createTextLabel(text) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const size = 256;
    canvas.width = size;
    canvas.height = size;

    ctx.fillStyle = 'red';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, size / 2, size / 2);

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(10, 5, 1);
    sprite.position.set(3, 0, 0);
    return sprite;
}


function createRing(data) {
    const ringGeometry = new THREE.RingGeometry(data.radius * 1.2, data.radius * 1.3, 64);
    const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2;
    return ring;
}
export { createSphere, createTextLabel, createRing };