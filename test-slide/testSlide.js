const classStyle = {
    containerId: 'containerSlide',
    containerClass: 'container',
    lineSlide: 'lineSlide',
    slide: 'slide'
}
class TestSlide {
    constructor(element, option = {}, amountBanners) {

        // Элемент, куда будет рендериться слайдер
        this.container = element

        // Ширина слайда
        this.sizeSlider = this.container.getBoundingClientRect().width;
        // Количество баннеров
        this.amountBanners = amountBanners

        this.manageHTML = this.manageHTML.bind(this)
        this.setParameters = this.setParameters.bind(this)
        this.manageHTML();
        this.setParameters();
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
            slideLine.insertAdjacentElement('afterbegin', slide())
        }

    }

    setParameters() {
        // Находим ширину линии слайдера
        this.lineSize = this.sizeSlider * this.amountBanners;
        // Добавляем ширину линии слайдера, найденную выше
        this.container.querySelector(`.${classStyle.lineSlide}`).style.width = `${this.lineSize}px`;

        // Добавляем ширин каждому слайду
        Array
            .from(this.container
            .querySelector(`.${classStyle.lineSlide}`).children)
            .map((slide) => {
                slide.style.width = `${this.sizeSlider}px`
            })


        console.log(this.lineSize)
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