// Классы
const GalleryClassName = 'gallery'
const GalleryLineClassName = 'gallery-line'
const GallerySlideClassName = 'gallery-slide'

class Gallery {
    constructor(element, option = {}) {
        // Обертка слайдера
        this.containerNode = element;
        
        // Кол-во слайдов гелереи
        this.size = element.childElementCount;

        // первый слайд при запуске
        this.currentSlide = 0

        this.currentSlideWasChanged = false

        // Делаем bind
        this.manageHTML = this.manageHTML.bind(this)
        this.setParameters = this.setParameters.bind(this)
        this.setEvents = this.setEvents.bind(this)
        this.resizeGallery = this.resizeGallery.bind(this)
        this.startDrag = this.startDrag.bind(this)
        this.stopDrag = this.stopDrag.bind(this)
        this.dragging = this.dragging.bind(this)
        this.setStylePosition = this.setStylePosition.bind(this)

        // Обертки для html
        this.manageHTML()

        // Задаем параметры
        this.setParameters()

        // Задаем события
        this.setEvents()

    }

    manageHTML() {
        // Добавляем класс нашей обретки
        this.containerNode.classList.add(GalleryClassName)

        // Изменяем внутренний HTML нашего эелемента
        this.containerNode.innerHTML = `
            <div class="${GalleryLineClassName}" >
                ${this.containerNode.innerHTML}
            </div>
        `
        // Получаем в js
        this.lineNode = this.containerNode.querySelector(`.${GalleryLineClassName}`)

        // Определяем slide nodes
        this.slideNodes = Array.from(this.lineNode.children).map((childNode) =>
            wrapElementByDiv({
                element: childNode,
                className: GallerySlideClassName
            })
        )
    }

    // Параметры, задаем ширину элементов
    setParameters() {
        // Находим ширину контейнера галереи
        const coordsContainer = this.containerNode.getBoundingClientRect()
        this.width = coordsContainer.width
        this.x = -this.currentSlide * this.width

        // Задаем ширину линии контейнера слайдов
        this.lineNode.style.width = `${this.size * this.width}px`

        // Задаем ширину каждого слайда
        Array.from(this.slideNodes).forEach((slideNode) => {
            slideNode.style.width = `${this.width}px`
        })
    }

    setEvents() {
        this.debouncedResizeGallery = debounce(this.resizeGallery)
        window.addEventListener('resize', this.debouncedResizeGallery)
        this.lineNode.addEventListener('pointerdown', this.startDrag)
        window.addEventListener('pointerup', this.stopDrag)
    }

    destroyEvents() {
        window.removeEventListener('resize', this.debouncedResizeGallery)
    }
    // Пересчитываем размеры галереи, при резайсе окна браузера, что бы слайдер не сломался
    resizeGallery() {
        // пересчитываем размера контейнера
        this.setParameters()
    }

    startDrag(evt) {
        this.currentSlideWasChanged = false
        // Место, где кликнули/зажали мышь
        this.clickX = evt.pageX
        this.startX = this.x
        console.log('this.startX --> ', this.startX)
        window.addEventListener('pointermove', this.dragging)
    }

    // Удаляем событиt dragging когда отпускаем мышку/палец
    stopDrag() {
        window.removeEventListener('pointermove', this.dragging)
        this.x = -this.currentSlide * this.width
        // console.log('this.x --> ', this.x)
        // console.log('this.width --> ', this.width)
        // console.log('this.currentSlide --> ', this.currentSlide)
        this.setStylePosition()
    }

    // Производим рассчеты перемещения слайдов
    dragging(evt) {
        // Место, где отпустили клик/отпстили мышь
        this.dragX = evt.pageX
        const dragShift = this.dragX - this.clickX

        // Добавляем новую позицию/ где слайд остановился, оттуда и тянем в след. раз
        this.x = this.startX + dragShift
        console.log('this.dragX --> ', this.dragX)
        console.log('this.clickX --> ', this.clickX)
        console.log('this.x --> ', this.x)
        this.setStylePosition()

        if (dragShift > 20 &&
            dragShift > 0 &&
            !this.currentSlideWasChanged &&
            this.currentSlide > 0
            
        ) {
            this.currentSlideWasChanged = true;
            this.currentSlide = this.currentSlide - 1
        }

        if (
            dragShift < -20 &&
            dragShift < 0 &&
            !this.currentSlideWasChanged &&
            this.currentSlide < this.size - 1
        ) {
            this.currentSlideWasChanged = true
            this.currentSlide = this.currentSlide + 1
        }
    }
    setStylePosition(shift) {
        this.lineNode.style.transform = `translate3d(${this.x}px, 0 ,0)`
    }
}

// Helpers
function wrapElementByDiv({element, className}) {
    const wrapperNode = document.createElement('div');
    wrapperNode.classList.add(className)

    element.parentNode.insertBefore(wrapperNode, element)
    wrapperNode.appendChild(element)

    return wrapperNode
}
// Сокращение обновлений ресайза у окна браузера
function debounce(func, time = 100) {
    let timer
    return function (event) {
        clearTimeout(timer)
        timer = setTimeout(func, time)
    }
}