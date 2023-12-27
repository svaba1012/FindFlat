import React from "react";

import { RootProvider } from "../src/context/RootProvider";

import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>FindFlat</title>

        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN"
          crossOrigin="anonymous"
        ></link>
        <link
          rel="stylesheet"
          href="//cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.min.css"
        />
        <link
          rel="stylesheet"
          href="//cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/leaflet.draw.css"
        />

        <script
          src="https://kit.fontawesome.com/7867ac1278.js"
          crossOrigin="anonymous"
        ></script>
        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
          integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL"
          crossOrigin="anonymous"
        ></script>
        <script
          src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
          integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
        ></script>
      </head>
      <RootProvider>
        <body className=" tw-bg-background tw-text-text tw-h-screen">
          <nav className="navbar navbar-expand-lg tw-bg-col3">
            <div className="container ">
              <a className="navbar-brand" href="/">
                <h2>
                  FindFlat <i className="fa-solid fa-building"></i>
                </h2>
              </a>
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarTogglerDemo02"
                aria-controls="navbarTogglerDemo02"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div
                className="collapse navbar-collapse"
                id="navbarTogglerDemo02"
              >
                <ul className="navbar-nav me-auto mb-0 mb-lg-0">
                  <li className="nav-item">
                    <a
                      className="nav-link active tw-pt-px tw-pb-px"
                      aria-current="page"
                      href="/notifications"
                    >
                      <h5 className="tw-mt-0 tw-mb-0">
                        Notifications <i className="fa-solid fa-bell"></i>
                      </h5>
                    </a>
                  </li>
                  <li className="nav-item"></li>
                </ul>
                <div className="dropdown tw-hidden lg:tw-block">
                  <button
                    className="btn tw-text-background "
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="fa-solid fa-gear"></i>{" "}
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <a className="dropdown-item" href="#">
                        Signout{" "}
                        <div className=" tw-float-right">
                          <i className="fa-solid fa-arrow-right-from-bracket "></i>
                        </div>
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="tw-block lg:tw-hidden">
                  <ul className="navbar-nav me-auto mt-2 mb-lg-0">
                    <div className="nav-item">
                      <a
                        className="nav-link active tw-pt-px tw-pb-px"
                        aria-current="page"
                        href="#"
                      >
                        Signout{" "}
                        <i className="fa-solid fa-arrow-right-from-bracket "></i>
                      </a>
                    </div>
                  </ul>
                </div>
              </div>
            </div>
          </nav>

          <div className="container tw-pt-7 ">{children}</div>
        </body>
      </RootProvider>
    </html>
  );
}
