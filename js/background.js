$(function () {
    const STAR_COUNT = (window.innerWidth + window.innerHeight) / 5,
        STAR_SIZE = 3,
        STAR_MIN_SCALE = 0.2;

    const canvas = document.querySelector('canvas'),
        context = canvas.getContext('2d');

    // 设备像素
    let scale = 1,
        width,
        height;

    let stars = [];

    let velocity = { x: 0, y: 0, tx: 0, ty: 0, z: 0.0005 };


    generate();
    resize();
    step();


    function generate() {

        for (let i = 0; i < STAR_COUNT; i++) {
            stars.push({
                x: 0,
                y: 0,
                z: STAR_MIN_SCALE + Math.random() * (1 - STAR_MIN_SCALE)
            });
        }

    }

    function placeStar(star) {

        star.x = Math.random() * width;
        star.y = Math.random() * height;

    }


    function resize() {

        scale = window.devicePixelRatio || 1;

        width = window.innerWidth * scale;
        height = window.innerHeight * scale;

        canvas.width = width;
        canvas.height = height;

        stars.forEach(placeStar);

    }

    function step() {

        context.clearRect(0, 0, width, height);

        render();

    }

    function render() {

        stars.forEach((star) => {

            context.beginPath();
            context.lineCap = 'round';
            context.lineWidth = STAR_SIZE * star.z * scale;
            context.strokeStyle = 'rgba(255,255,255,' + (0.5 + 0.5 * Math.random()) + ')';

            context.beginPath();
            context.moveTo(star.x, star.y);

            let tailX = velocity.x * 2,
                tailY = velocity.y * 2;

            if (Math.abs(tailX) < 0.1) tailX = 0.5;
            if (Math.abs(tailY) < 0.1) tailY = 0.5;

            context.lineTo(star.x + tailX, star.y + tailY);

            context.stroke();

        });

    }
});