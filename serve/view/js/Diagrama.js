class Diagrama {
    construct(element, param)
    {
        this.config = {

        }

        this.element = element

        this.getWideScreen()
        this.load()
        alert(1)
    }

    getWideScreen() {
        
        console.log(window.getComputedStyle(this.element, null).width);
    }

    load(){

    }
}