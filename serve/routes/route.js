module.exports = (app) => {
    app.get("/", (request, response) => {
        response.sendFile("index.html", {root: "./views"})
    })
}