var canvas = document.getElementById("view2"),
	ctx = canvas.getContext("2d"),
	canvas2 = document.createElement("canvas"),
	ctx2 = canvas2.getContext("2d"),
	view = document.getElementById("view");

var spam = `There I was again tonight Forcing laughter, faking smiles Same old tired, lonely place Walls of insincerity, shifting eyes and vacancy Vanished when I saw your face All I can say is, it was enchanting to meet you Your eyes whispered, "Have we met?" 'Cross the room your silhouette Starts to make its way to me The playful conversation starts Counter all your quick remarks Like passing notes in secrecy And it was enchanting to meet you All I can say is, I was enchanted to meet you This night is sparkling, don't you let it go I'm wonderstruck, blushing all the way home I'll spend forever wondering if you knew I was enchanted to meet you The lingering question kept me up 2 AM, who do you love? I wonder 'til I'm wide awake And now I'm pacing back and forth Wishing you were at my door I'd open up and you would say, "Hey" It was enchanting to meet you All I know is, I was enchanted to meet you This night is sparkling, don't you let it go I'm wonderstruck, blushing all the way home I'll spend forever wondering if you knew That this night is flawless, don't you let it go I'm wonderstruck, dancing around all alone I'll spend forever wondering if you knew I was enchanted to meet you This is me praying that This was the very first page Not where the story line ends My thoughts will echo your name, until I see you again These are the words I held back, as I was leaving too soon I was enchanted to meet you Please don't be in love with someone else Please don't have somebody waiting on you Please don't be in love with someone else Please don't have somebody waiting on you This night is sparkling, don't you let it go I'm wonderstruck, blushing all the way home I'll spend forever wondering if you knew This night is flawless, don't you let it go I'm wonderstruck, dancing around all alone I'll spend forever wondering if you knew I was enchanted to meet you Please don't be in love with someone else Please don't have somebody waiting on you`;

var letters = window.innerWidth * window.innerHeight / 12;
var text = "";
while(text.length < letters) {
	text += spam;
}
view.innerHTML = text;

canvas.width = canvas2.width = window.innerWidth;
canvas.height = canvas2.height = window.innerHeight;

var imgSize = window.innerWidth / 7, tm, set = false;

var cols = Array(Math.floor(canvas.width / 32) + 1).fill(0);
var text = "ILOVEYOUBASHI";
var textLength = text.length;

for(var i = 0; i < cols.length; ++i) {
	cols[i] = Math.round(Math.random() * (canvas.height / 32)) * 32;
}


var initiated = false;

var audio = new Audio('sound/enchanted.mp3');
var analyser, x = 0, bufferLength, dataArray, barWidth, barHeight;



window.addEventListener("resize", () => {
	canvas.width = canvas2.width = window.innerWidth;
	canvas.height = canvas2.height = window.innerHeight;

	var imgSize = window.innerWidth / 7, tm, set = false;
	
	cols = Array(Math.floor(canvas.width / 32) + 1).fill(0);
	for(var i = 0; i < cols.length; ++i) {
		cols[i] = Math.round(Math.random() * (canvas.height / 32)) * 32;
	}

	if(initiated) {
		barWidth = (canvas.width / bufferLength) * 4;
	}
	
	var letters = window.innerWidth * window.innerHeight / 12;
	var text = "";
	while(text.length < letters) {
		text += spam;
	}
	view.innerHTML = text;
})

var img = new Image();
img.src = "./img/5.jpg";

var cursor = new Image();
cursor.src = "./img/heart.png";

var lerp = (a, b, c) => (1-c) * a + c * b;
var clamp = (v, m, x) => Math.max(m, Math.min(v, x));

class Blight {
	constructor(x, y, tx, ty, size, speed) {
		this.x = x;
		this.y = y;
		this.tx = tx;
		this.ty = ty;
		this.size = size;
		this.updated = false;
		this.speed = speed;
	}

	update() {
		this.x = lerp(this.x, this.tx, this.speed);
		this.y = lerp(this.y, this.ty, this.speed);
		this.distance = Math.sqrt((this.x - this.tx) ** 2 + (this.y - this.ty) ** 2);
		this.updated = this.distance > 1;
	}
}

var blights = [new Blight(-100, -100, -100, -100, window.innerWidth / 8, 0.1)];

for(var i = 0; i < 20; ++i) {
	var x = Math.random() * canvas.width;
	var y = Math.random() * canvas.height;
	blights.push(new Blight(x, y, x, y, Math.random() * window.innerWidth / 20 + window.innerWidth / 10, 0.007 + Math.random() * 0.005));
}

var mousemove = (e) => {
	if(e.type == "touchmove") {
		e.clientX = Math.round(e.touches[0].clientX);
		e.clientY = Math.round(e.touches[0].clientY);
	}
	blights[0].tx = e.clientX;
	blights[0].ty = e.clientY;
	set = false;
	if(!blights[0].updated) {
		blights[0].x = e.clientX;
		blights[0].y = e.clientY;
		blights[0].updated = true;
	}
}

window.addEventListener("mousemove", mousemove);
window.addEventListener("touchmove", mousemove);

ctx2.font = '32px monospace';
ctx2.textAlign = "left";
ctx2.textBaseLine = "top";

var draw = () => {
	ctx.globalCompositeOperation = "source-over";
	for(var blight of blights) {
		if(blight != blights[0]) {
			blight.tx = clamp(Math.random() * 100 * (-1 + 2 * Math.round(Math.random())) + blight.tx, 0, canvas.width);
			blight.ty = clamp(Math.random() * 100 * (-1 + 2 * Math.round(Math.random())) + blight.ty, 0, canvas.height);
			blight.size = clamp(Math.random() * 10 * (-1 + 2 * Math.round(Math.random())) + blight.size, 100, 300);
		}
		blight.update();
		if(blight.updated) {
			ctx.drawImage(cursor, blight.x - blight.size / 2, blight.y - blight.size / 2, blight.size, blight.size);
		}
		else if(blight == blights[0] && !set) {
			set = true;
		}
	}


	if(initiated) {
		x = 0;
		analyser.getByteFrequencyData(dataArray);

		for (var i = 0; i < bufferLength; i+= 2) {
			barHeight = dataArray[i] * 1.2;
			ctx.fillRect(canvas.width / 2 - x - barWidth, canvas.height / 2 - barHeight / 2, barWidth - 4, barHeight);
			if(i+1 < bufferLength) {
				barHeight = dataArray[i + 1] * 1.2;
				ctx.fillRect(canvas.width / 2 + x, canvas.height / 2 - barHeight / 2, barWidth - 4, barHeight);
			}

			x += barWidth;
	    }

	}
	var length = cols.length
	for(var i = 0; i < length; ++i) {
		var j = cols[i];
		if(j > canvas.height) cols[i] = 0;
		ctx.drawImage(cursor, i * 32, j, 32, 32)
		cols[i] += 8;
	}

	ctx.globalCompositeOperation = "source-in";
	ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

	ctx2.clearRect(0, 0, canvas.width, canvas.height)
	ctx2.globalAlpha = 0.95;
	ctx2.drawImage(canvas, 0, 0);

	ctx.globalCompositeOperation = "source-over";
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.drawImage(canvas2, 0, 0);
	setTimeout(draw, 30)
}
draw();

var ily = document.getElementById("ily");
var mousein = () => {
	ily.style.animationName = "none";
}

var mouseout = () => {
	ily.style.animationName = "blink";
}

ily.addEventListener("mouseenter", mousein);
ily.addEventListener("mouseout", mouseout);

var play = document.getElementById("play")
play.addEventListener("click", () => {
	audio.play();
	play.style.width = "0px";

	var context = new AudioContext();
	var src = context.createMediaElementSource(audio);
	analyser = context.createAnalyser();

	src.connect(analyser);
	analyser.connect(context.destination);

	analyser.fftSize = 512;
	bufferLength = analyser.frequencyBinCount;

	dataArray = new Uint8Array(bufferLength);

	barWidth = (canvas.width / bufferLength) * 4;

	initiated = true;

})