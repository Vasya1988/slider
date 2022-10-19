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
        this.changeActiveSlide = false

        
        // Количество баннеров
        this.amountBanners = amountBanners

        this.settings = {
            margin: option.margin || 0
        }

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
                slide.style.width = `${this.sizeSlider + this.settings.margin}px`
                slide.style.marginRight = `${this.settings.margin}px`
            })

        // Переменная для замедления оттягивания последнего слайда
        this.maximumX = -(this.lineNode.childElementCount - 1) * (this.sizeSlider + this.settings.margin);

        // Разобрать, понять -------------------------------
        // Добавляем свойство, котороые потом перезапишем
        // и добавим в свойство startX
        this.x = -this.currentSlide * (this.sizeSlider + this.settings.margin)
        
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
        this.changeActiveSlide = false
        this.clickX = event.pageX;
        // StartX по умолчанию = 0, при загрузке страницы
        // При последукющих событиях Pointermove, startX значение 
        // будет меняться и начало движения слайдера будет с пердыдущей точки остановки
        this.startX = this.x;
        this.resetStyleTransition()
        window.addEventListener('pointermove', this.dragging)
        // console.log('this.x --> ', this.x)
        // console.log(-this.currentSlide, this.sizeSlider)
        // console.log('startX --> ', this.startX)
    }

    stopDrag() {
        window.removeEventListener('pointermove', this.dragging);
        
        this.x = -this.currentSlide * this.sizeSlider
        this.setStylePosition(this.x)
        this.setStyleTransition()
    }

    dragging(evt) {
        // console.log(evt)
        this.dragX =  evt.pageX;
        const shift = this.dragX - this.clickX;
        // console.log(this.dragX, this.clickX);

        // Переменная для анимации замедления оттягивания крайних слайдов
        const easing = shift / 5;

        // Разобрать, понять ---------------------------------
        // В startX после первого события, будет лежать thisX к которому
        // мы добавим новое кол-во px которые мы перетянули событием pointermove
        // Записываем сколько px мы протащили pointermove (зажатую мышь)
        // и при следующем событии этот this.x уйдет в this.startX, 
        // Что бы продолжить перетаскивание слайдера с той точки, 
        // где остановились
        // this.x = this.startX + this.shift;

        // Math.max И Math.min здесть нужны только для замедления анимации на крайних слайдах
        this.x = Math.max(Math.min(this.startX + shift, easing), this.maximumX + easing);

        this.setStylePosition(this.x)

        if (
            shift > 20 && 
            shift > 0 &&
            !this.changeActiveSlide &&
            this.currentSlide > 0
        ) {
            this.changeActiveSlide = true
            this.currentSlide = this.currentSlide - 1
        }

        if (
            shift < -20 && 
            shift < 0 &&
            !this.changeActiveSlide &&
            this.currentSlide < this.lineNode.childElementCount - 1
        ) {
            this.changeActiveSlide = true
            this.currentSlide = this.currentSlide + 1
        }
    }

    setStylePosition(shift) {
        this.lineNode.style.transform = `translate3d(${shift}px, 0, 0)`
    }

    setStyleTransition() {
        this.lineNode.style.transition = `all .35s ease 0s`
    }
    resetStyleTransition() {
        this.lineNode.style.transition = `all 0s ease 0s`
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