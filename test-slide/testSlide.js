const classStyle = {
    containerId: 'containerSlide',
    containerClass: 'container',
    lineSlide: 'lineSlide',
    slide: 'slide',
    slideImage: 'image'
}
class TestSlide {
    constructor(element, option = {}, amountBanners) {

        // Элемент, куда будет рендериться слайдер
        this.container = element

        // Первый слайд при запуске слайдера
        this.currentSlide = 0

        
        // Количество баннеров
        this.amountBanners = amountBanners

        this.manageHTML = this.manageHTML.bind(this)
        this.setParameters = this.setParameters.bind(this)
        this.setEvents = this.setEvents.bind(this)
        this.resizeSlides = this.resizeSlides.bind(this)
        this.startDrag = this.startDrag.bind(this)
        this.setEvents = this.setEvents.bind(this)
        this.dragging = this.dragging.bind(this)
        this.stopDrag = this.stopDrag.bind(this)
        this.setStylePosition = this.setStylePosition.bind(this)
        this.manageHTML();
        this.setParameters();
        this.setEvents();
    }

    // Управление HTML, render
    manageHTML() {

        // Добавляем разметку сладера на страницу
        this.container.insertAdjacentElement('afterbegin', container());

        // Добавляем классы и линию слайдера
        const slideLine = this.container
            .querySelector(`.${classStyle.containerClass}`)
            .insertAdjacentElement('afterbegin', lineSlide());

        // Добавляем количество слайдов
        for (let i = 0; i < this.amountBanners; i++) {
            slideLine.insertAdjacentElement('afterbegin', slide());
            slideLine.querySelector(`.${classStyle.slide}`).innerHTML = `
                <img src='' class=${classStyle.slideImage} />
            `
        }



    }

    setParameters() {
        // Ширина слайда
        this.sizeSlider = this.container.getBoundingClientRect().width;
        // Находим ширину линии слайдера
        this.lineSize = this.sizeSlider * this.amountBanners;
        // Добавляем ширину линии слайдера, найденную выше
        this.lineNode = this.container.querySelector(`.${classStyle.lineSlide}`);
        this.lineNode.style.width = `${this.lineSize}px`;

        // Добавляем ширину каждому слайду
        Array
            .from(this.container
            .querySelector(`.${classStyle.lineSlide}`).children)
            .map((slide) => {
                slide.style.width = `${this.sizeSlider}px`
            })

        // Разобрать, понять -------------------------------
        this.x = -this.currentSlide * this.sizeSlider
    }

    setEvents() {
        window.addEventListener('resize', boundingEvent(this.resizeSlides))
        this.lineNode.addEventListener('pointerdown', this.startDrag)
        this.lineNode.addEventListener('pointerup', this.stopDrag)
    }

    // resize слайд линии и слайдов
    resizeSlides() {
        this.setParameters()
    }

    // Начало движения линии слайдера
    startDrag(event) {
        this.clickX = event.pageX;
        this.startX = this.x;
        window.addEventListener('pointermove', this.dragging)
    }

    stopDrag() {
        window.removeEventListener('pointermove', this.dragging);
    }

    dragging(evt) {
        // console.log(evt)
        this.dragX =  evt.pageX;
        this.shift = this.dragX - this.clickX;
        console.log(this.dragX, this.clickX);
        // Разобрать, понять ---------------------------------
        this.x = this.startX + this.shift
        this.setStylePosition()
    }

    setStylePosition(shift) {
        this.lineNode.style.transform = `translate3d(${this.x}px, 0, 0)`
    }
}

// Helpers
const container = () => {
    const createContainer = document.createElement('div');
    createContainer.setAttribute('id', classStyle.containerId);
    createContainer.classList.add(classStyle.containerClass)
    
    return createContainer
}

// Создаем линиюс слайдера
const lineSlide = () => {
    const line = document.createElement('div');
    line.classList.add(classStyle.lineSlide)

    return line
}

// Создаем слайд
const slide = () => {
    const slide = document.createElement('div');
    slide.classList.add(classStyle.slide)

    slide.style.backgroundColor = `rgb(${randomColor()})`

    return slide
}

// Случаынй цвет для теста Random color for a test
const randomColor = () => {
    let color = [];
    for (i = 0; i < 3; i++) color.push(Math.floor(Math.random() * 255));

    return color.join(', ')
}

// Сокращение обновлений ресайза у окна браузера
const boundingEvent = (func, time = 100) => {
    let timer;
    return function() {
        clearTimeout(timer)
        timer = setTimeout(func, time)
    }
}