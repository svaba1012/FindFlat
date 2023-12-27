import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

import {
  WebFlatItem,
  WebFlatQuery,
} from "../services/web-scraping/flat-web-scraping/WebFlatTypes";
import { Notification } from "../models/notification-model";
import { WebScrapable } from "../services/web-scraping/WebScrapable";
import { HaloOglasiWebScrape } from "../services/web-scraping/flat-web-scraping/HaloOglasiWebScrape";
import { EmailService } from "../services/email/email-service";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { NotFoundError } from "../errors/NotFoundError";
import { User } from "../models/user-model";

type webScrapeNewest = {
  scrape: WebScrapable;
  newestItem?: WebFlatItem;
  newFound?: boolean;
};

let webFlatScrapes: webScrapeNewest[] = [{ scrape: new HaloOglasiWebScrape() }];

let notificationTimers: {
  timer: NodeJS.Timeout | null | undefined;
  notification: any;
}[] = [];
// get notifications from db and push it to notifications

const webScrapeCheckForNewest = async () => {};

const startNotificationPeriodicSearch = (notification: any, email: string) => {
  return setInterval(async () => {
    // ZA SAD JE OVAKO, TREBA BRISATI NEPOTREBNE TAJMERE
    if (!notification.turned) {
      console.log("ISKLJUCENO");
      return;
    }

    let webFlatItems: WebFlatItem[] = [];

    await Promise.all(
      webFlatScrapes.map(async (webFlatScrape, i) => {
        webFlatItems = (await webFlatScrape.scrape.searchWeb(
          JSON.parse(notification.filter)
        )) as WebFlatItem[];
        if (!webFlatScrape.newestItem) {
          webFlatScrape.newestItem = webFlatItems[0];
          webFlatScrape.newFound = true; //false
          console.log("Initial web scrape");
        } else if (webFlatItems[0].name != webFlatScrape.newestItem.name) {
          webFlatScrape.newestItem = webFlatItems[0];
          webFlatScrape.newFound = true;
          console.log("New flat found");
        } else {
          webFlatScrape.newFound = false;
          console.log("There is no new flats");
        }
      })
    );

    let flats: WebFlatItem[];

    flats = webFlatScrapes
      .filter((item) => {
        return item.newFound;
      })
      .map((el) => el.newestItem as WebFlatItem);

    if (flats.length > 0) {
      // send email
      console.log("Sending notification for new flats");
      let emailService = new EmailService();
      emailService.sendFlatNotificationMail(email, flats);
    }
  }, 30 * 1000);
};

const startNotificationTask = async (notification: any, email: string) => {
  let webFlatScrapes: webScrapeNewest[] = [
    { scrape: new HaloOglasiWebScrape() },
  ];

  let i = notificationTimers.push({ timer: null, notification }) - 1;

  let timer = startNotificationPeriodicSearch(
    notificationTimers[i].notification,
    email
  );

  notificationTimers[i].timer = timer;
};

const startNotificationsTasks = async () => {
  let notifications = await Notification.find();
  await Promise.all(
    notifications.map(async (notification, i) => {
      let notificationUser = await User.findById(notification.user);
      await startNotificationTask(notification, notificationUser!.email);
    })
  );
};

startNotificationsTasks();

// read
const getUserNotifications = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let curUser = req.currentUser;
  if (!curUser) {
    next(new UnauthorizedError());
    return;
  }
  let id = curUser?.id;
  let notifications = await Notification.find({ user: id });
  if (!notifications) {
    res.send({ notifications: [] });
  }
  res.send({ notifications });
};
// write
const writeUserNotification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("PROBA");
  let webFlatQuery = req.body as unknown as WebFlatQuery;
  let currentUser = req.currentUser;
  if (!currentUser) {
    next(new UnauthorizedError());
    return;
  }

  let notification = new Notification({
    filter: JSON.stringify(webFlatQuery),
    user: currentUser.id,
    turned: true,
  });
  await notification.save();

  await startNotificationTask(notification, currentUser.email);

  res.status(201).send({ notification });
};

// delete
const deleteUserNotification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let curUser = req.currentUser;
  let { id } = req.params;
  let notification = await Notification.findById(id);
  if (!notification) {
    next(new NotFoundError("Resources not found"));
    return;
  }
  if (curUser?.id != notification.user) {
    next(new UnauthorizedError());
    return;
  }
  console.log("SRBIJA");

  notificationTimers.filter((el) => {
    if (el.notification.id == id) {
      clearInterval(el.timer as NodeJS.Timeout);
      return false;
    }
    return true;
  });

  await notification.deleteOne();

  res.status(204).send({});
};
// edit
const editUserNotification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // implement later
  let curUser = req.currentUser;
  let { id } = req.params;
  let editedFields = req.body;

  if (!curUser) {
    next(new UnauthorizedError());
    return;
  }
  let notification = await Notification.findById(id);
  if (!notification) {
    next(new NotFoundError("Resources not found"));
    return;
  }
  if (curUser?.id != notification.user?.toString()) {
    next(new UnauthorizedError());
    return;
  }

  notificationTimers.map((el) => {
    if (el.notification.id == id) {
      if (el.notification.turned != editedFields.turned) {
        el.notification.turned = editedFields.turned;
      }
      // IMPLEMENTIRAJ NEZAVISNOST OD POLJA BODIJA DODAJ IZMENU FILTERA
    }
    return el;
  });

  // IMPLEMENTIRAJ NEZAVISNOST OD POLJA BODIJA
  notification.filter = notification.filter; // || editedFields.filter;
  notification.turned = editedFields.turned && notification.turned;
  await notification!.save();

  res.status(200).send({ notification });
};

export default {
  getUserNotifications,
  writeUserNotification,
  deleteUserNotification,
  editUserNotification,
};
