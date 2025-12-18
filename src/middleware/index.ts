import { json, urlencoded, type Application } from "express";
import cookieParser from "cookie-parser";

export default (app: Application) => {
      app.use(urlencoded({extended: true}));
      app.use(json())
      app.use(cookieParser());
};    