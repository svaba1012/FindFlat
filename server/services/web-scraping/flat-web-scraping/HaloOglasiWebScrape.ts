import axios from "axios";
import { JSDOM } from "jsdom";

import { WebQuery, WebScrapable, WebSellableItem } from "../WebScrapable";
import { WebFlatItem, WebFlatQuery } from "./WebFlatTypes";

const HALO_OGLASI_CITY_IDS = {
  beograd: 35112,
  "novi-sad": 35194,
  nis: 35188,
  sabac: 35223,
};

const HALO_OGLASI_TYPES_URIS: Object = {
  Stan: "stanova",
  Kuca: "kuca",
  Garaza: "garaza",
  Lokal: "lokala",
  Soba: "soba",
};

const HALO_OGLASI_TYPES_CATEGORIES: Object = {
  Stan: 12,
  Kuca: 24,
  Garaza: 28,
  Lokal: 32,
  Soba: 61,
};

export class HaloOglasiWebScrape implements WebScrapable {
  makeCityString(city: string) {
    return city.toLocaleLowerCase().replace(" ", "-");
  }

  getUri(query: WebFlatQuery) {
    let uri = "prodaja-";
    if (query.sellOrRent != "Prodaja") {
      uri = "izdavanje-";
    }
    return uri + HALO_OGLASI_TYPES_URIS[query.type as keyof Object];
  }

  getCategoryId(query: WebFlatQuery) {
    let isRenting = query.sellOrRent != "Prodaja";
    let categoryId = HALO_OGLASI_TYPES_CATEGORIES[query.type as keyof Object];
    return Number(categoryId) + (isRenting ? 1 : 0) + "";
  }

  convertNumberOfRoomsToId(numOfRooms: number | undefined) {
    if (!numOfRooms) {
      return numOfRooms;
    }
    if (numOfRooms < 3) {
      return numOfRooms / 0.5;
    } else {
      return numOfRooms / 0.5 + 1;
    }
  }

  async findFlatsInLocationArea(query: WebFlatQuery) {
    let city = this.makeCityString(query.city as string);

    let cityId = HALO_OGLASI_CITY_IDS[city as keyof Object];

    let isRenting = this.getUri(query);
    let categoryId = this.getCategoryId(query);

    let bodyLocation: any[] = (query.location as string).split(";");
    bodyLocation[bodyLocation.length - 1] = bodyLocation[0];
    bodyLocation = bodyLocation.map((areaDot) => {
      let areaDotArr = areaDot.split(",");
      return { Lat: Number(areaDotArr[0]), Lng: Number(areaDotArr[1]) };
    });

    let body = {
      RangeQueries: [
        {
          UnitId: 4,
          FieldName: "defaultunit_cena_d",
          From: String(query.price_min),
          To: String(query.price_max),
          IncludeEmpty: true,
          _min: null,
          _max: null,
        },
        {
          UnitId: 1,
          FieldName: "defaultunit_kvadratura_d",
          From: String(query.surface_min),
          To: String(query.surface_max),
          IncludeEmpty: true,
          _min: null,
          _max: null,
        },
        {
          FieldName: "broj_soba_order_i",
          From: this.convertNumberOfRoomsToId(query.numberOfRoomsMin),
          To: this.convertNumberOfRoomsToId(query.numberOfRoomsMax),
          IncludeEmpty: false,
        },
      ],
      MultiFieldORQueries: [
        {
          FieldName: "grad_id_l-lokacija_id_l-mikrolokacija_id_l",
          FieldValues: [cityId],
        },
      ],
      FieldQueries: [],
      FieldORQueries: [
        {
          FieldName: "CategoryIds",
          FieldValues: [categoryId],
        },
      ],
      HasValueQueries: [],
      GeoPolygonQuery: {
        Operation: 2,
        FieldName: "location_rpt",
        GeoPolygon: bodyLocation,
      },
      GeoCircleQuery: {},
      CategoryId: categoryId,
      SearchTypeIds: [2, 3],
      SortFields: [
        {
          FieldName: "ValidFromForDisplay",
          Ascending: false,
        },
      ],
      GetAllGeolocations: true,
      ItemsPerPage: 20,
      PageNumber: 1,
      IsGrid: false,
      fetchBanners: false,
      QuasiTaxonomy: "/" + city,
      BaseTaxonomy: "/nekretnine/" + isRenting,
      RenderSEOWidget: true,
    };

    let res = await axios.post(
      "https://www.halooglasi.com/Quiddita.Widgets.Ad/AdCategoryBasicSearchWidgetAux/GetSidebarData",
      body
    );
    let flatItems: WebFlatItem[] = res.data.Ads.map((flatItem: any) => {
      let flatItemHtml = flatItem.ListHTML.replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&amp;nbsp;/g, " ")
        .replace(/&#39;/g, "'");
      let flatDomItem = new JSDOM(flatItemHtml).window.document.querySelector(
        ".product-item"
      );

      let name = flatItem.Title;
      let link = "https://www.halooglasi.com" + flatItem.RelativeUrl;

      // extract price
      let price = flatDomItem?.querySelector(".central-feature")?.textContent;
      if (price) {
        price = price.substring(0, price.indexOf("€") - 1);
      }

      // extract image
      let imageUrl = flatDomItem
        ?.querySelector(".a-images")
        ?.querySelector("img")
        ?.getAttribute("src")
        ?.replace("'", "")
        .replace("'", "");

      // extract city
      let city = flatDomItem?.querySelector(".subtitle-places")?.textContent;

      // extract surface, numOfRooms and floor
      let features = flatDomItem?.querySelectorAll(
        ".product-features .value-wrapper"
      );

      let numberOfRooms: string | null | undefined = "";
      let surface: string | null | undefined = "";
      let floor: string | null | undefined = "";

      console.log(flatItemHtml);
      if (features && features.length > 2) {
        surface = features.item(0).textContent;
        surface = surface?.substring(0, surface.indexOf("m") - 1);
        if (surface) {
        }
        numberOfRooms = features.item(1).textContent;
        numberOfRooms = numberOfRooms?.substring(
          0,
          numberOfRooms.indexOf("B") - 1
        );
        floor = features.item(2).textContent;
        floor = floor?.substring(0, floor.indexOf("S") - 1);
      }

      let description = flatDomItem?.querySelector(
        ".product-description"
      )?.textContent;

      // console.log(flatItemHtml);

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

  async findFlatsWithoutLocationArea(query: WebFlatQuery) {
    let city = this.makeCityString(query.city as string);

    let isRenting = this.getUri(query);
    let url = `https://www.halooglasi.com/nekretnine/${isRenting}/${city}`;

    // making query params
    let params: any = {
      cena_d_to: query.price_max,
      cena_d_from: query.price_min,
      cena_d_unit: 4,
      kvadratura_d_from: query.surface_min,
      kvadratura_d_to: query.surface_max,
      kvadratura_d_unit: 1,
      broj_soba_order_i_from: this.convertNumberOfRoomsToId(
        query.numberOfRoomsMin
      ),
      broj_soba_order_i_to: this.convertNumberOfRoomsToId(
        query.numberOfRoomsMax
      ),
    };
    let res = await axios.get(url, {
      params,
    });

    console.log(axios.getUri({ url, params }));
    let htmlStr = res.data;

    // console.log(htmlStr);
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

  async searchWeb(query: WebFlatQuery): Promise<WebFlatItem[]> {
    if (query.location) {
      return await this.findFlatsInLocationArea(query);
    }
    return await this.findFlatsWithoutLocationArea(query);
  }
}
