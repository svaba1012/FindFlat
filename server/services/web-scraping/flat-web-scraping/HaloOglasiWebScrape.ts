import axios from "axios";
import { JSDOM } from "jsdom";

import { WebQuery, WebScrapable, WebSellableItem } from "../WebScrapable";
import { WebFlatItem, WebFlatQuery } from "./WebFlatTypes";

export class HaloOglasiWebScrape implements WebScrapable {
  async searchWeb(query: WebFlatQuery): Promise<WebFlatItem[]> {
    // making URL
    let city = "beograd";
    let isRenting = "prodaja-stanova";
    if (query.sellOrRent != "Prodaja") {
      isRenting = "izdavanje-stanova";
    }
    let url = `https://www.halooglasi.com/nekretnine/${isRenting}/${query.city}`;

    console.log(url);

    // making query params
    let params = {
      cena_d_to: query.price_max,
      cena_d_from: query.price_min,
      cena_d_unit: 4,
      kvadratura_d_from: query.surface_min,
      kvadratura_d_to: query.surface_max,
      kvadratura_d_unit: 1,
      broj_soba_order_i_from: 2,
    };

    let res = await axios.get(url, {
      params,
    });

    // console.log(res);

    // console.log(res.data);
    let htmlStr = res.data;

    var doc = new JSDOM(htmlStr).window.document;

    let flatDomItems = doc.querySelectorAll(".product-item");

    let flatItems: WebFlatItem[] = [...flatDomItems].map((flatDomItem) => {
      // extract price
      let price = flatDomItem.querySelector(".central-feature")?.textContent;
      if (price) {
        price = price.substring(0, price.indexOf("€") - 1);
      }

      // extract image
      let imageUrl = flatDomItem
        .querySelector(".a-images")
        ?.querySelector("img")
        ?.getAttribute("src");

      // extract name
      let name = flatDomItem.querySelector(".product-title")?.textContent;

      // extract link
      let link =
        "https://www.halooglasi.com" +
        flatDomItem
          .querySelector(".product-title")
          ?.querySelector("a")
          ?.getAttribute("href");

      // extract city
      let city = flatDomItem.querySelector(".subtitle-places")?.textContent;

      // extract surface, numOfRooms and floor
      let features = flatDomItem.querySelectorAll(
        ".product-features .value-wrapper"
      );

      let numberOfRooms: string | null | undefined = "";
      let surface: string | null | undefined = "";
      let floor: string | null | undefined = "";

      if (features.length > 2) {
        surface = features[0].textContent;
        surface = surface?.substring(0, surface.indexOf("m") - 1);
        if (surface) {
        }
        numberOfRooms = features[1].textContent;
        numberOfRooms = numberOfRooms?.substring(
          0,
          numberOfRooms.indexOf("B") - 1
        );
        floor = features[2].textContent;
        floor = floor?.substring(0, floor.indexOf("S") - 1);
      }

      let description = flatDomItem.querySelector(
        ".product-description"
      )?.textContent;

      return {
        price,
        currency: "€",
        imageUrl,
        name,
        type: "stan",
        address: "",
        floor,
        link,
        maxFloor: "",
        numberOfRooms,
        location: "",
        description,
        surface,
        surfaceUnit: "m2",
        city,
      };
    });

    return flatItems.filter((item) => {
      return item.price;
    });
  }
}
