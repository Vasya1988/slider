const classStyle = {
    containerId: 'containerSlide',
    containerClass: 'container'
}
class TestSlide {
    constructor(element, option = {}) {
        this.container = element

        this.manageHTML = this.manageHTML.bind(this)
        this.manageHTML();
    }


    manageHTML() {
        this.container.insertAdjacentElement('afterbegin', container(element.container = document.createElement('div')));
    }
}

// Helpers
const container = (element = {}) => {
    const createContainer = element //document.createElement('div');
    createContainer.setAttribute('id', classStyle.containerId);
    createContainer.classList.add(classStyle.containerClass)
    
    return createContainer
}

// const slide = () => {
//     const createSlide = document.createElement('div');
//     createSlide
// }