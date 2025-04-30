var isPlaying = false;
var score = 0;
var lives;
var dropSpeed; // Set a constant drop speed
var action;
var highScore = 0;

var fruits = ['apple', 'banana', 'grapes', 'mango', 'orange', 'peach', 'pear', 'pineapple', 'tomato', 'watermelon'];

function getHighScore() {
    var dbRef = db.ref().child("scores");
    dbRef.on('value', (snapshot) => {
        const data = snapshot.val();
        if (data != null) {
            highScore = data;
        }
    });
}

function showHighScore() {
    window.alert("High Score: " + highScore);
}

$(function () {
    getHighScore();

    $("#highScore").click(function () {
        showHighScore();
    });
    $("#highScore1").click(function () {
        showHighScore();
    });

    $("#start").click(function () {
        if (isPlaying == true) {
            location.reload();
        } else {
            isPlaying = true;
            score = 0;
            adjustDropSpeed();
            $("#value").html(score);
            $("#menubar").hide();
            $("#liferem").css('display', 'flex');
            $("#container").css({ 'display': 'flex' });
            lives = 3;
            addHeart();
            startFruits();
        }
    });

    $("#restart").click(function () {
        location.reload();
    });
});

$("#fruit").mouseover(cut);

function addHeart() {
    $("#life").empty();
    for (i = 0; i < lives; i++) {
        $("#life").append(`<img src="images/heart.png" class="heart">`);
    }
}

function startFruits() {
    chooseFruit();
    $("#fruit").css({ 'left': Math.round(($("#container").width() - 350) * Math.random()) + 200, 'top': -50 });
    $("#fruit").css({ 'display': 'flex' });

    console.log("dropSpeed", dropSpeed); // Log the constant drop speed

    action = setInterval(function () {
        $("#fruit").css('top', $("#fruit").position().top + dropSpeed);
        if ($("#fruit").position().top > $("#container").height()) {
            if (lives > 1) {
                $("#fruit").css({ 'display': 'flex' });
                chooseFruit();
                $("#fruit").css({ 'left': Math.round(($("#container").width() - 350) * Math.random()) + 200, 'top': -50 });

                lives -= 1;
                addHeart();
            } else {
                isPlaying = false; // Fix typo from playing to isPlaying
                $("#liferem").css('display', 'none');
                $("#fsc").text(score);
                lives -= 1;
                addHeart();
                $("#endgame").show();
                stopAction();
            }
        }
    }, 10);
}

function chooseFruit() {
    $("#fruit").attr('src', 'images/' + fruits[Math.round(9 * Math.random())] + '.png');
}

function stopAction() {
    if (score > highScore) {
        highScore = score;
        db.ref().child("scores").set(highScore);
    }
    clearInterval(action);
    $("#fruit").hide();
}

function cut() {
    score++;
    $("#value").html(score);
    $("#slicesound")[0].play();
    $("#fruit").hide("explode", 500);
    $("#fruit").css({ 'display': 'flex' });
    clearInterval(action);

    setTimeout(startFruits, 800);
}


function adjustDropSpeed() {
    // Example logic to adjust speed based on device performance
    const screenWidth = window.innerWidth;
    if (screenWidth < 600) { // For small devices
        dropSpeed = 1; // Slower speed for mobile devices
    } else {
        dropSpeed = 1; // Normal speed for larger devices
    }
}




$(document).ready(function () {
    let touchPath = [];
    let isDrawing = false;

    // Track touch movement
    $("#container").on("touchstart", function (e) {
        // If touch starts on a button, don't track drawing
        if ($(e.target).is("#restart, #highScore1")) {
            return;
        }

        isDrawing = true;
        const touch = e.originalEvent.touches[0];
        touchPath = [{ x: touch.pageX, y: touch.pageY }];
        e.preventDefault();
    });

    $("#container").on("touchmove", function (e) {
        if (!isDrawing) return;
        const touch = e.originalEvent.touches[0];
        touchPath.push({ x: touch.pageX, y: touch.pageY });

        // Check for fruit intersection with the touch path
        const fruit = $("#fruit");
        const fruitPos = fruit.offset();
        const fruitWidth = fruit.width();
        const fruitHeight = fruit.height();

        // Check if the last point of the touch path intersects with the fruit
        const lastPoint = touchPath[touchPath.length - 1];

        if (lastPoint) {
            if (
                lastPoint.x >= fruitPos.left &&
                lastPoint.x <= fruitPos.left + fruitWidth &&
                lastPoint.y >= fruitPos.top &&
                lastPoint.y <= fruitPos.top + fruitHeight
            ) {
                cut(); // Call the cut function if the fruit is sliced
            }
        }
    });

    $("#container").on("touchend", function () {
        isDrawing = false;
        touchPath = [];
    });
});
