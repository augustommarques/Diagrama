class Diagrama {
    constructor(element, param)
    {
        this.config = {
            
        }

        this.loadData()
        this.loadParam()
    }

    loadParam () {
        alert('param')
    }

    loadData() {
        fetch('js/data.json')
            .then((response) => {
                return response.json()
            }).then((data) => {
                console.log(data)
            })
            .catch(function() {
                // handle the error
            });
    }
}