import React from "react";
import Link from "next/link";

function FlatItem({ flat }) {
  return (
    <div
      className="card mb-3 tw-bg-background tw-text-text tw-border-text tw-h-fit"
      style={{ maxWidth: 800 }}
    >
      <div className="row g-0">
        <div className="col-md-4 tw-max-h-64 ">
          <img
            src={flat.imageUrl}
            className="img-fluid rounded-start tw-object-cover tw-h-full tw-w-full"
            alt="..."
          />
        </div>
        <div className="col-md-8">
          <div className="card-body">
            <div className="tw-absolute tw-bg-primary tw-top-2 tw-right-2 tw-text-text  tw-rounded-md">
              <div className="tw-font-bold tw-p-1 tw-pl-3 tw-pr-3 tw-pb-0">
                {flat.price} {flat.currency}
              </div>
              <div className=" tw-w-full tw-h-px tw-bg-background"></div>
              <div className="tw-p-1 tw-pt-0 tw-pl-3 tw-pr-3">
                {(flat.price.replace(".", "") / flat.surface.replace(",", ""))
                  .toFixed(0)
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}{" "}
                {flat.currency}/{flat.surfaceUnit}{" "}
              </div>
            </div>
            <h5 className="card-title tw-font-bold tw-mr-28">
              <Link href={flat.link} className=" tw-text-text tw-no-underline">
                {flat.name}
              </Link>
            </h5>
            <p className="card-text tw-font-semibold tw-mb-1 tw-mr-28">
              {flat.city}
            </p>
            <div className="card-text tw-flex tw-gap-1 tw-bg-col3 tw-w-fit tw-rounded tw-text-background">
              <div className="tw-p-1">
                <div>Kvadratura</div>
                <div>
                  {flat.surface} m<sup>2</sup>{" "}
                </div>
              </div>
              <div className=" tw-bg-background tw-w-px"></div>
              <div className="tw-p-1">
                <div>Broj soba</div>
                <div>{flat.numberOfRooms}</div>
              </div>
              <div className=" tw-bg-background tw-w-px"></div>
              <div className="tw-p-1">
                <div>Spratnost</div> <div> {flat.floor}</div>
              </div>
            </div>
            <p className="card-text tw-mt-3">{flat.description}</p>
            {/* <p className="card-text">
              <small className="text-body-secondary">
                Last updated 3 mins ago
              </small>
            </p> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FlatItem;
