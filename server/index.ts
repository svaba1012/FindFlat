import mongoose from "mongoose";
import { app } from "./app";

mongoose
  .connect(process.env!.DATABASE_URL)
  .then(() => {
    app.listen(4000, () => {
      console.log("Server listen on port 4000");
    });
  })
  .catch(() => {
    console.log("Can't connect to db");
  });
