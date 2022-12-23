import express from "express";
import consign from 'consign';

module.exports = () => {
    const app = express()
    app.use(express.static("./view"))

    consign().include("routes").into(app)

    return app
}