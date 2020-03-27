window.onload = function () {
    let canvas = document.querySelector('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let c = canvas.getContext('2d');

    const colors = ['#54123b', '#84142d', '#C02739', '#29c7ac', '#116979'];

    function randomColor() {
        return colors[Math.floor(Math.random() * (colors.length))];
    }

    function distance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
    }

    function rotate(velocity, angle) {
        const rotatedVelocities = {
            x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
            y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
        };

        return rotatedVelocities;
    }

    function resolveCollision(particle, otherParticle) {
        const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
        const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

        const xDist = otherParticle.x - particle.x;
        const yDist = otherParticle.y - particle.y;

        // Prevent accidental overlap of particles
        if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

            // Grab angle between the two colliding particles
            const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);

            // Store mass in var for better readability in collision equation
            const m1 = particle.mass;
            const m2 = otherParticle.mass;

            // Velocity before equation
            const u1 = rotate(particle.velocity, angle);
            const u2 = rotate(otherParticle.velocity, angle);

            // Velocity after 1d collision equation
            const v1 = {x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y};
            const v2 = {x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y};

            // Final velocity after rotating axis back to original location
            const vFinal1 = rotate(v1, -angle);
            const vFinal2 = rotate(v2, -angle);

            // Swap particle velocities for realistic bounce effect
            particle.velocity.x = vFinal1.x;
            particle.velocity.y = vFinal1.y;

            otherParticle.velocity.x = vFinal2.x;
            otherParticle.velocity.y = vFinal2.y;
        }
    }

    function Circle(x, y, dx, dy, radios, color) {
        this.x = x;
        this.y = y;
        this.velocity = {
            x: (Math.random() - 0.5) * 15,
            y: (Math.random() - 0.5) * 15
        };
        this.radios = radios;
        this.color = color;
        this.mass = 1;

        this.draw = () => {
            c.beginPath();
            c.arc(this.x, this.y, this.radios, Math.PI * 2, false);
            c.fillStyle = this.color;
            c.fill();
        };

        this.update = particles => {
            for (let i = 0; i < particles.length; ++i) {
                if (this === particles[i]) continue;

                if (distance(this.x, this.y, particles[i].x, particles[i].y) < (this.radios + particles[i].radios)) {
                    resolveCollision(this, particles[i]);
                    let tempColor = this.color;
                    this.color = particles[i].color;
                    particles[i].color = tempColor;

               
                }
            }
            if (this.x + this.radios >= innerWidth || this.x - this.radios < 0) {
                this.velocity.x = -this.velocity.x;
            }
            if (this.y + this.radios >= innerHeight || this.y - this.radios < 0) {
                this.velocity.y = -this.velocity.y;
            }
            this.x += this.velocity.x;
            this.y += this.velocity.y;

            this.draw();
        };
    }

    let circleArray = [];

    function createCircle(x, y, event) {
        console.log(event);
        let radios = (Math.random() * 40) + 12;
        let dx = (Math.random() - 0.5) * 15;
        let dy = (Math.random() - 0.5) * 15;
        let color = randomColor();

        circleArray.push(new Circle(x, y, dx, dy, radios, color));
    }

    function animate() {
        requestAnimationFrame(animate);
        c.clearRect(0, 0, innerWidth, innerHeight);

        for (let i = 0; i < circleArray.length; ++i) {
            circleArray[i].update(circleArray);
        }
    }

    animate();
    document.querySelector("body").addEventListener('click', (e) => {
        createCircle(e.clientX, e.clientY, e);
    });
};





















