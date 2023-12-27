"use client";
import React, { useEffect, useState } from "react";

import NotificationItem from "../../src/components/NotificationItem";
import { useRequest } from "../../src/hooks/useRequest";

function NotificationsPage(props) {
  let [notifications, setNotifications] = useState([]);
  let fetchHook = useRequest(
    process.env.NEXT_PUBLIC_SERVER_URL + "/api/notifications",
    "get"
  );

  useEffect(() => {
    const fetchNotifications = async () => {
      let res = await fetchHook.doRequest({ withCredentials: true });
      setNotifications(res.data.notifications);
    };
    fetchNotifications();
  }, []);

  return (
    <div className="row">
      {notifications &&
        notifications.map((notification, id) => (
          <NotificationItem
            title={`Flat notification #${id + 1}`}
            key={id}
            notification={notification}
            deleteNotifyParent={() => {
              setNotifications(notifications.filter((el, i) => i != id));
            }}
            editNotifyParent={(objChange) => {
              setNotifications(
                notifications.map((el, i) => {
                  if (i == id) {
                    return { ...el, ...objChange };
                  } else {
                    return el;
                  }
                })
              );
            }}
          />
        ))}
    </div>
  );
}

export default NotificationsPage;
