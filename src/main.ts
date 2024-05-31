import "./style.css";

const pop = document.getElementById("pop");
const accept = document.getElementById("accept");

interface Vec2 {
  x: number;
  y: number;
}

const dist = (v1: Vec2, v2: Vec2) => Math.hypot(v2.x - v1.x, v2.y - v1.y);

const addVecs = (v1: Vec2, v2: Vec2) => ({ x: v1.x + v2.x, y: v1.y + v2.y });
const subVecs = (v1: Vec2, v2: Vec2) => ({ x: v1.x - v2.x, y: v1.y - v2.y });
const multVec = (v: Vec2, multiplier: number) => ({
  x: v.x * multiplier,
  y: v.y * multiplier,
});
const limitVec = (v: Vec2, limit: number) => {
  const l = Math.sqrt(v.x * v.x + v.y * v.y);
  return l < limit ? v : { x: v.x * (limit / l), y: v.y * (limit / l) };
};

const avoid = (target: Vec2, pos: Vec2, vel: Vec2, maxForce: number) => {
  let force = subVecs(target, pos);
  force = subVecs(force, vel);
  force = limitVec(force, maxForce);
  return multVec(force, -1);
};

if (accept && pop) {
  pop.showPopover();
  let pos: Vec2 = {
    x: window.innerWidth / 2 - accept.getBoundingClientRect().width / 2,
    y: window.innerHeight / 2 + accept.getBoundingClientRect().height,
  };

  let vel: Vec2 = { x: 0, y: 0 };
  let acc: Vec2 = { x: 0, y: 0 };
  let maxSpeed = 4.5;
  let maxForce = 1;

  let mousePos: Vec2 = { x: 0, y: 0 };

  document.addEventListener("mousemove", (ev) => {
    mousePos = { x: ev.clientX, y: ev.clientY };
  });

  accept.addEventListener("click", () => {
    pop.style.position = "static";
    accept.style.position = "static";
    pop.hidePopover();
  });

  accept.style.left = `${pos.x}px`;
  accept.style.top = `${pos.y}px`;

  const step = () => {
    // Behave!
    if (dist(pos, mousePos) < 140) {
      acc = addVecs(acc, avoid(mousePos, pos, vel, maxForce));
    }

    // Friction
    vel = multVec(vel, 0.99);

    // Move!

    vel = addVecs(vel, acc);
    vel = limitVec(vel, maxSpeed);
    pos = addVecs(pos, vel);
    acc = { x: 0, y: 0 };

    if (pos.x <= 0) {
      console.log("bounds left");
      pos.x = window.innerWidth;
    }

    if (pos.x > window.innerWidth) {
      console.log("bounds right");
      pos.x = 0;
    }

    if (pos.y <= 0) {
      pos.y = window.innerHeight;
    }

    if (pos.y > window.innerHeight) {
      pos.y = 0;
    }

    accept.style.left = `${pos.x}px`;
    accept.style.top = `${pos.y}px`;

    requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
}
