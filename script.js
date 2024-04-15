// Variables globales
let player, obstacle, score;
let obstacleInterval; // Variable para almacenar el intervalo de generación de obstáculos
let runningInterval; // Variable para almacenar el intervalo de movimiento continuo del jugador



// Inicialización del juego
function init() {
    player = document.getElementById("player");
    obstacle = document.getElementById("obstacle");
    score = 0;
    movePlayer();
    generateObstacles();
}

// Mover al jugador
function movePlayer() {
    // Mover continuamente al jugador hacia adelante
    runningInterval = setInterval(() => {
        if (player.offsetLeft < window.innerWidth) { // Comprueba si el jugador está dentro del área visible del juego
            player.style.left = player.offsetLeft + 2 + "px"; // Cambia el valor 2 por el valor que desees para ajustar la velocidad
        } else { // Si el jugador alcanza el borde derecho, mueve todos los elementos al borde izquierdo para crear un efecto de desplazamiento continuo
            player.style.left = "-60px";
            obstacle.style.left = "600px";
        }
    }, 20);

    // Hacer que el jugador salte al hacer clic en la pantalla
    document.addEventListener("click", function () {
        jump();
    });
}

function jump() {
    // Verificar si el jugador ya está saltando
    if (player.classList.contains("jumping")) {
        return;
    }

    player.classList.add("jumping");

    let jumpHeight = 250; // Altura máxima del salto
    let jumpSpeed = 60; // Velocidad del salto
    let jumpDuration = 900; // Duración máxima del salto (en milisegundos)
    let jumpTime = 0; // Tiempo transcurrido durante el salto
    let jumpInterval = setInterval(() => {
        // Hacer que el jugador suba
        if (player.offsetTop > 150 && jumpHeight > 0 && jumpTime < jumpDuration) {
            player.style.top = player.offsetTop - jumpSpeed + "px";
            jumpHeight -= jumpSpeed;
            jumpTime += 20; // Incrementar el tiempo transcurrido
        }
        // Hacer que el jugador baje
        else {
            clearInterval(jumpInterval);
            let fallInterval = setInterval(() => {
                // Hacer que el jugador vuelva al suelo
                if (player.offsetTop < 340) {
                    player.style.top = player.offsetTop + 10 + "px";
                    // Ajustar la posición del jugador para que se quede en el suelo
                    if (player.offsetTop > 340) {
                        player.style.top = "340px";
                    }
                } else {
                    clearInterval(fallInterval);
                    player.classList.remove("jumping");
                }
            }, 20);
        }
    }, 20);
}

// Generar obstáculos continuamente
function generateObstacles() {
    obstacleInterval = setInterval(() => {
        resetObstacle();
        moveObstacle();
    }, 2000); // Genera un nuevo obstáculo cada 2 segundos
}

function moveObstacle() {
    let obstaclePosition = window.innerWidth; // Inicializa la posición del obstáculo al borde derecho del área visible

    function animate() {
        if (obstaclePosition < 0) {
            resetObstacle();
        } else {
            obstaclePosition -= 5; // Reducir este valor para mover el obstáculo más lento
            obstacle.style.left = obstaclePosition + "px";

            // Verificar colisión con el jugador
            let playerRect = player.getBoundingClientRect();
            let obstacleRect = obstacle.getBoundingClientRect();
            if (
                playerRect.x < obstacleRect.x + obstacleRect.width &&
                playerRect.x + playerRect.width > obstacleRect.x &&
                playerRect.y < obstacleRect.y + obstacleRect.height &&
                playerRect.y + playerRect.height > obstacleRect.y
            ) {
                clearInterval(obstacleInterval); // Detener la generación de obstáculos
                clearInterval(runningInterval); // Detener el movimiento continuo del jugador
                alert("Carlitos, puedes hacerlo mejor 🤪");
            }

            // Incrementa la puntuación cuando el jugador esquiva un obstáculo
            if (obstaclePosition + obstacleRect.width < playerRect.x && !obstacle.passed) {
                score++;
                document.getElementById("score").innerHTML = "Puntuación: " + score;
                obstacle.passed = true; // Marcar el obstáculo como pasado para no incrementar la puntuación más de una vez
            }
        }
        requestAnimationFrame(animate);
    }
    animate();
}


// Reiniciar la posición del obstáculo
function resetObstacle() {
    obstacle.style.left = "600px"; // Aparece desde el borde derecho
    obstacle.style.top = "400px"; // Posición fija en el suelo
}

function playMusic() {
    let music = document.getElementById('gameMusic');
    music.play();
}




// Iniciar el juego al cargar la página
window.onload = function() {
    init();
};
