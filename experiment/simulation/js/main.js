'use strict';

document.addEventListener('DOMContentLoaded', function() {


    const restartButton = document.getElementById('restart');
    restartButton.addEventListener('click', restart);

    const playButton = document.getElementById('play');
    playButton.addEventListener('click', play);

    const pauseButton = document.getElementById('pause');
    pauseButton.addEventListener('click', pause);

    const slider = document.getElementById('speed');
    const output = document.getElementById('demo_speed');
    output.innerHTML = (slider.value) / 4;
    slider.oninput = function() {
        output.innerHTML = (this.value) / 4;
        fps = originalfps * (output.innerHTML);
        restart();
    };

    const sliders = ["turn", "widthString", "widthMaterial", "mass"];
    sliders.forEach(function(elem, ind) {
        const slider = document.getElementById(elem);
        const output = document.getElementById("demo_" + elem);
        output.innerHTML = slider.value; // Display the default slider value

        slider.oninput = function() {
            output.innerHTML = this.value;
            params[elem] = Number(document.getElementById(elem).value);
            restart();
        };
    });

    function setAll() {
        topStringLength = 200;
        ratio = -1;
    }

    function restart() {
        window.clearTimeout(tmHandle);
        setAll();
        play();
    }

    function play() {
        tmHandle = window.setTimeout(draw, 1000 / fps);
        pauseButton.removeAttribute("disabled");
        restartButton.removeAttribute("disabled");
        playButton.setAttribute("disabled", "true");
    }

    function pause() {
        window.clearTimeout(tmHandle);
        pauseButton.setAttribute("disabled", "true");
        playButton.removeAttribute("disabled");
    }

    function drawObject(ctx, obj, color) {
        ctx.save();
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(obj[0][0], obj[0][1]);

        for (let i = 0; i < obj.length; ++i) {
            const next = (i + 1) % obj.length;
            ctx.lineTo(obj[next][0], obj[next][1]);
        }

        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }


    const canvas = document.getElementById("main");
    canvas.width = 900;
    canvas.height = 1200;
    canvas.style = "border:3px solid;";
    const ctx = canvas.getContext("2d");

    const originalfps = 20;
    let fps = 20;

    const midX = canvas.width / 2;
    let topStringLength;
    let params = {
        "mass": 150,
        "turn": 4,
        "widthString": 100,
        "widthMaterial": 15,
    };
    let ratio;
    let direction = 0;
    let box = [];
    let end;
    let tmHandle;

    setAll();
    drawStatic();

    function drawStatic() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.lineWidth = params["widthMaterial"];
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.font = "50px Arial";

        ctx.moveTo(midX, 0);
        ctx.beginPath();
        let countOfTurns = 0;
        let turn = 0;
        ctx.moveTo(midX, 0);
        ctx.lineTo(midX, topStringLength);

        for (let i = 0;; i++) {
            const start = midX + params["widthString"] * Math.sin(i * Math.PI / 72 * ratio);
            if (start >= midX && turn === 0) {
                turn = 1;
                countOfTurns++;
            }
            if (start < midX) {
                turn = 0;
            }
            if (countOfTurns === params["turn"]) {
                end = i + topStringLength;
                break;
            }
            ctx.lineTo(midX + params["widthString"] * Math.sin(i * Math.PI / 72 * ratio), topStringLength + i);
        }
        ctx.moveTo(midX, end);
        ctx.lineTo(midX, end + 100);
        ctx.stroke();

        box = [
            [midX + params["mass"] / 2, end + 100],
            [midX + params["mass"] / 2, end + 100 + params["mass"]],
            [midX - params["mass"] / 2, end + 100 + params["mass"]],
            [midX - params["mass"] / 2, end + 100],
        ];
        drawObject(ctx, box, "black");
        let deflection = 8 * 9.8 * params["mass"]; // 8gW
        deflection *= (params["widthString"] ** 3); // D^3
        deflection *= params["turn"]; // n
        deflection /= (params["widthMaterial"] ** 4); // d^4

        deflection /= 1000;
        deflection = deflection.toPrecision(6);

        let stiffness = (params["mass"] * params["mass"]) / deflection;
        stiffness = stiffness.toPrecision(6);

        document.getElementById("deflection").innerHTML = deflection.toString();
        document.getElementById("stiffness").innerHTML = stiffness.toString();

    }

    function draw() {
        drawStatic();
        if (ratio <= -2) {
            direction = 0;
        } else if (ratio >= -1) {
            direction = 1;
        }
        if (direction === 0) {
            ratio += 0.1;
            topStringLength += 10;

        } else {
            ratio -= 0.1;
            topStringLength -= 10;
        }
        tmHandle = window.setTimeout(draw, 2000 / fps);
    }

});
