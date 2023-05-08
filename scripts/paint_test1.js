
async function canvastest() {
	// берём любое изображение

	url = "/public/bu.jpg";
	let f = await fetch(url);
	let blob = await f.blob();
	let img = document.createElement('img');
	img.style = 'position:fixed;top:10%;left:10%;width:80%';
	document.body.append(img);
	img.src = URL.createObjectURL(blob);

	let img1 = document.querySelector('img');

	// создаём <canvas> того же размера
	let canvas = document.createElement('canvas');
	canvas.width = img1.clientWidth;
	canvas.height = img1.clientHeight;

	let context = canvas.getContext('2d');

	// копируем изображение в  canvas (метод позволяет вырезать часть изображения)
	context.drawImage(img1, 1, 0);
	// мы можем вращать изображение при помощи context.rotate() и делать множество других преобразований

	// toBlob является асинхронной операцией, для которой callback-функция вызывается при завершении
	canvas.toBlob((blob) => {
		// после того, как Blob создан, загружаем его
		let link = document.createElement('a');
		link.download = 'example.png';

		link.href = URL.createObjectURL(blob);
		link.click();

		// удаляем внутреннюю ссылку на Blob, что позволит браузеру очистить память
		URL.revokeObjectURL(link.href);
	}, 'image/png');
}


async function testfetch3() {
	url = "/public/bu.jpg";
	let f = await fetch(url);
	let blob = await f.blob();
	alert(Cookie)
	// создаём <img>
	let img = document.createElement('img');
	let bl = document.createElement('input');
	let br = document.createElement('input');

	img.addEventListener("click", () => somefunc(img), false);
	bl.addEventListener("click", () => bl.remove(), false);
	br.addEventListener("click", () => br.remove(), false);

	img.style = 'position:fixed;top:10%;left:10%;width:80%';
	bl.style = 'position:fixed;top:10%;left:2%;width:7%;height:100px';
	br.style = 'position:fixed;top:10%;right:2%;width:7%;height:100px';
	bl.type = "button";
	br.type = "button";
	bl.value="left";
	br.value="right";
	// img.style = 'margin:auto;display:block;width:40%;';
	// img.tabIndex="213";
	document.body.append(img);
	document.body.append(bl);
	document.body.append(br);

	// выводим на экран
	img.src = URL.createObjectURL(blob);

	/*
	setTimeout(() => { // прячем через три секунды
		somefunc(img);
	}, 3000);
	*/


}
