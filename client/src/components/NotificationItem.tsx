import React, { useState } from "react";
import { useRequest } from "../hooks/useRequest";

let switchTimer;

function NotificationItem({
  title,
  notification,
  deleteNotifyParent,
  editNotifyParent,
}) {
  let filter = JSON.parse(notification.filter);

  let deleteReqHook = useRequest(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/notifications/${notification.id}`,
    "delete"
  );

  let switchReqHook = useRequest(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/notifications/${notification.id}`,
    "patch"
  );

  const deleteNotification = async () => {
    await deleteReqHook.doRequest({ withCredentials: true });
    deleteNotifyParent();
  };

  const turnNotification = async (e) => {
    if (switchTimer) {
      clearTimeout(switchTimer);
      switchTimer = null;
    }
    editNotifyParent({ turned: e.target.checked });
    console.log(e.target.checked);
    switchTimer = setTimeout(() => {
      switchReqHook.doRequest({ turned: e.target.checked });
    }, 1000);
  };

  return (
    <div className="tw-p-4 col-lg-4 col-md-6">
      <div className="card mb-3 tw-bg-col3 tw-relative">
        <div
          className="form-check form-switch tw-absolute tw-top-4 tw-right-3"
          style={{ scale: 1.4 }}
        >
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            id="flexSwitchCheckDefault"
            value={notification.turned ? "on" : "off"}
            checked={notification.turned}
            onChange={turnNotification}
          />
          <label
            className="form-check-label"
            htmlFor="flexSwitchCheckDefault"
          ></label>
        </div>

        <div className="row g-0">
          <div className="col-md-12">
            <div className="card-body">
              <h5 className="card-title">{title}</h5>
              <ul className="card-text">
                <li>{`Tip: ${filter.type}`}</li>
                <li>{`Lokacija: ${filter.city}`}</li>
                <li>{`Cena: ${filter.price_min}-${filter.price_max} €`}</li>
                <li>
                  {`Povrsina: ${filter.surface_min}-${filter.surface_max}`} m
                  <sup>2</sup>{" "}
                </li>
              </ul>
              <button
                className="btn tw-bg-error tw-text-text"
                onClick={deleteNotification}
              >
                Obrisi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotificationItem;
