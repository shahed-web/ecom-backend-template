import { json, urlencoded, type Application } from "express";

export default (app: Application) => {
      app.use(urlencoded({extended: true}));
      app.use(json())
};    