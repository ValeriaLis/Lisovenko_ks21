function canvas(selector, options){
    const canvas = document.querySelector(selector);
    canvas.classList.add('canvas')
    canvas.setAttribute('width', `${options.width || 400}px`)
    canvas.setAttribute('height', `${options.height || 300}px`)
    // отримання контексту для малювання
    const context = canvas.getContext('2d')
   // отримуємо координати canvas відносно viewport
    const rect = canvas.getBoundingClientRect();
    let isPaint = false // чи активно малювання
    let points = [] //масив з точками
	// об’являємо функцію додавання точок в масив
    const addPoint = (x, y, dragging) => {
   // преобразуємо координати події кліка миші відносно canvas
        points.push({
            x: (x - rect.left),
            y: (y - rect.top),
            dragging: dragging
        })
    }
	 // головна функція для малювання
    const redraw = () => {
    //очищуємо  canvas
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        context.strokeStyle = options.strokeColor;
        context.lineJoin = "round";
        context.lineWidth = options.strokeWidth;
        let prevPoint = null;
        for (let point of points){
            context.beginPath();
            if (point.dragging && prevPoint){
                context.moveTo(prevPoint.x, prevPoint.y)
            } else {
                context.moveTo(point.x - 1, point.y);
            }
            context.lineTo(point.x, point.y)
            context.closePath()
            context.stroke();
            prevPoint = point;
        }
    }
	// функції обробники подій миші
    const mouseDown = event => {
        isPaint = true
        addPoint(event.pageX, event.pageY);
        redraw();
    }
    const mouseMove = event => {
        if(isPaint){
            addPoint(event.pageX, event.pageY, true);
            redraw();
        }
    }
    // додаємо обробку подій
    canvas.addEventListener('mousemove', mouseMove);
    canvas.addEventListener('mousedown', mouseDown);
    canvas.addEventListener('mouseup',() => {
        isPaint = false;
    });
    canvas.addEventListener('mouseleave',() => {
        isPaint = false;
    });
    // TOOLBAR
    const toolBar = document.getElementById('toolbar');
    // clear button
    const clearBtn = document.createElement('button');
    clearBtn.classList.add('btn');
    let clearIcon = document.createElement('i');
    clearIcon.classList.add('fas');
    clearIcon.classList.add('fa-broom');
    clearBtn.appendChild(clearIcon);
    clearBtn.addEventListener('click', () => {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        points = [];
    });
    toolBar.insertAdjacentElement('afterbegin', clearBtn);
    // Download
    const downloadBtn= document.createElement('button');
    downloadBtn.classList.add('btn');
    let downloadIcon = document.createElement('i');
    downloadIcon.classList.add('fas');
    downloadIcon.classList.add('fa-download');
    downloadBtn.appendChild(downloadIcon);
    downloadBtn.addEventListener('click', () => {
        const dataUrl = canvas.toDataURL("image/png").replace(/^data:image\/[^;]/, 'data:application/octet-stream');
        const newTab = window.open('about:blank','image from canvas');
        newTab.document.write("<img src='" + dataUrl + "' alt='from canvas'/>");
    });
    toolBar.insertAdjacentElement('afterbegin', downloadBtn);
    // Save
    const saveBtn= document.createElement('button');
    saveBtn.classList.add('btn');
    let saveIcon = document.createElement('i');
    saveIcon.classList.add('fas');
    saveIcon.classList.add('fa-save');
    saveBtn.appendChild(saveIcon);
    saveBtn.addEventListener('click', () => {
        localStorage.setItem('points', JSON.stringify(points));
    });
    toolBar.insertAdjacentElement('afterbegin', saveBtn);
    // Restore
    const restoreBtn= document.createElement('button');
    restoreBtn.classList.add('btn');
    let restoreIcon = document.createElement('i');
    restoreIcon.classList.add('fas');
    restoreIcon.classList.add('fa-window-restore');
    restoreBtn.appendChild(restoreIcon);
    restoreBtn.addEventListener('click', () => {
        let store_points = localStorage.getItem('points');
        points = JSON.parse(store_points);
        isPaint = true;
        redraw();
        isPaint = false;
    });
    toolBar.insertAdjacentElement('afterbegin', restoreBtn);
    // TimeStamp
    const timeBtn= document.createElement('button');
    timeBtn.classList.add('btn');
    let timeIcon = document.createElement('i');
    timeIcon.classList.add('fas');
    timeIcon.classList.add('fa-clock');
    timeBtn.appendChild(timeIcon);
    timeBtn.addEventListener('click', () => {
        let data = new Date();
        context.fillText(data.toString(), context.canvas.width - 430, context.canvas.height - 285);
    });
    toolBar.insertAdjacentElement('afterbegin', timeBtn);
    // Brush color
    const colorBrush = document.getElementById("color-picker");
    colorBrush.addEventListener("change", () => {
        options.strokeColor = colorBrush.value;
    });
    // Brush size
    const sizeBrush = document.getElementById("brush-picker");
    sizeBrush.addEventListener("change", () => {
        options.strokeWidth = sizeBrush.value;
    });
    // Background
    const getBackBtn = document.createElement('button');
    getBackBtn.classList.add('btn');
    let getBackIcon = document.createElement('i');
    getBackIcon.classList.add('fas');
    getBackIcon.classList.add('fa-plus-square');
    getBackBtn.appendChild(getBackIcon);
    getBackBtn.addEventListener('click', () => {
        const img = new Image;
        img.src = 'https://a-static.besthdwallpaper.com/solo-leveling-sung-jin-woo-oboi-62670_L.jpg';
        img.onload = () => {
            context.drawImage(img, 0, 0);
        };
    });
    toolBar.insertAdjacentElement('afterbegin', getBackBtn);
}