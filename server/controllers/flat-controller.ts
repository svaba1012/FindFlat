import { Request, Response, NextFunction } from "express";

import {
  WebFlatItem,
  WebFlatQuery,
} from "../services/web-scraping/flat-web-scraping/WebFlatTypes";
import { WebScrapable } from "../services/web-scraping/WebScrapable";
import { HaloOglasiWebScrape } from "../services/web-scraping/flat-web-scraping/HaloOglasiWebScrape";
import { EmailService } from "../services/email/email-service";
import { UnauthorizedError } from "../errors/UnauthorizedError";

let webFlatScrapes: WebScrapable[] = [new HaloOglasiWebScrape()];

let webFlatNewest: WebFlatItem[] = [];

let webFlatNewestFound: boolean[] = [];

const getFlats = async (req: Request, res: Response, next: NextFunction) => {
  let webFlatQuery = req.query as unknown as WebFlatQuery;

  console.log(webFlatQuery);

  let webFlatItems: WebFlatItem[] = [];

  await Promise.all(
    webFlatScrapes.map(async (webFlatScrape) => {
      webFlatItems = (await webFlatScrape.searchWeb(
        webFlatQuery
      )) as WebFlatItem[];
    })
  );

  res.send({ flats: webFlatItems });
};

const setFlatEmainNotification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let webFlatQuery = req.body as unknown as WebFlatQuery;
  let currentUser = req.currentUser;
  if (!currentUser) {
    next(new UnauthorizedError());
    return;
  }
  console.log(webFlatQuery);

  let webFlatItems: WebFlatItem[] = [];

  setInterval(async () => {
    await Promise.all(
      webFlatScrapes.map(async (webFlatScrape, i) => {
        webFlatItems = (await webFlatScrape.searchWeb(
          webFlatQuery
        )) as WebFlatItem[];
        if (webFlatNewest.length <= i) {
          console.log("Sifra:" + process.env.EMAIL_PASS + "...");
          webFlatNewest.push(webFlatItems[0]);
          webFlatNewestFound.push(true);
          console.log("Initial web scrape");
        } else if (webFlatItems[0].name != webFlatNewest[i].name) {
          webFlatNewest[i] = webFlatItems[0];
          webFlatNewestFound[i] = true;
          console.log("New flat found");
        } else {
          webFlatNewestFound[i] = false;
          console.log("There is no new flats");
        }
      })
    );

    let flats: WebFlatItem[];

    flats = webFlatNewest.filter((item, i) => {
      return webFlatNewestFound[i];
    });

    if (flats.length > 0) {
      // send email
      console.log("Sending notification for new flats");
      let emailService = new EmailService();
      emailService.sendFlatNotificationMail(currentUser!.email, flats);
    }
  }, 30 * 1000);

  res.send({});
};

export { getFlats, setFlatEmainNotification };
