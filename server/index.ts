import mongoose from "mongoose";

import { app } from "./app";
import { HaloOglasiWebScrape } from "./services/web-scraping/flat-web-scraping/HaloOglasiWebScrape";

mongoose
  .connect(process.env!.DATABASE_URL)
  .then(() => {
    app.listen(4000, async () => {
      console.log("Server listen on port 4000");
      // let halo = new HaloOglasiWebScrape();

      // let res = await halo.searchWeb({
      //   numberOfRooms: 1,
      //   price: { min: 10000, max: 100000 },
      //   currency: "rsd",
      //   surface: { min: 10, max: 100 },
      //   city: "beograd",
      //   isRentable: false,
      //   location: {},
      //   sortDescending: true,
      //   sortCriteria: "price",
      //   surfaceUnit: "m2",
      //   type: "flat",
      // });

      // console.log(res);
    });
  })
  .catch(() => {
    console.log("Can't connect to db");
  });
