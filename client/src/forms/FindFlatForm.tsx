"use client";

import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import CustomDropdown from "../components/CustomDropdown";
import CustomDualSlider from "../components/CustomDualSlider";
import CustomCheckbox from "../components/CustomCheckbox";
import { useRequest } from "../hooks/useRequest";
import CustomMap from "../components/CustomMapAreaSelect";

const townsWithLocations = [
  { label: "Beograd", location: [44.787197, 20.457273] },
  { label: "Novi Sad", location: [45.267136, 19.833549] },
  { label: "Nis", location: [43.320902, 21.895759] },
  { label: "Sabac", location: [44.748861, 19.690788] },
];

const MAX_RENT_PRICE = 1000;
const MAX_SELL_PRICE = 200000;
const MAX_ROOMS_NUM = 5.5;

function FindFlatForm(props) {
  let {
    handleSubmit,
    watch,
    formState: { errors },
    register,
  } = useForm();

  let reqHook = useRequest(
    process.env.NEXT_PUBLIC_SERVER_URL + "/api/notifications",
    "post"
  );

  let [price, setPrice] = useState([0, MAX_SELL_PRICE]);
  let [surface, setSurface] = useState([0, 500]);
  let [numberOfRooms, setNumberOfRooms] = useState([0, MAX_ROOMS_NUM]);
  let [areaCoords, setAreaCoords] = useState([]);
  let [shouldMapRecenter, setShouldMapRecenter] = useState(true);
  let [priceSliderMax, setPriceSliderMax] = useState(MAX_SELL_PRICE);

  let router = useRouter();

  const createQueryStringFromObject = (obj: any) => {
    const params = new URLSearchParams();
    Object.keys(obj).forEach((key) => {
      params.set(key, obj[key]);
    });
    return params.toString();
  };

  const onSubmit = async (formData) => {
    if (formData.with_area) {
      formData.location = areaCoords.reduce((sum, el, i) => {
        return sum + el.lat + "," + el.lng + ";";
      }, "");
    }
    console.log(formData);
    console.log(createQueryStringFromObject(formData));
    delete formData.with_area;

    let formFormatedData: any = {
      ...formData,
      surfaceUnit: "m2",
      currency: "€",
      price_min: price[0],
      price_max: price[1],
      surface_min: surface[0],
      surface_max: surface[1],
    };

    if (numberOfRooms[1] < MAX_ROOMS_NUM) {
      formFormatedData.numberOfRoomsMax = numberOfRooms[1];
    }

    if (numberOfRooms[0] > 0) {
      formFormatedData.numberOfRoomsMin = numberOfRooms[0];
    }

    if (!formData.emailNotifyForm) {
      delete formData.emailNotifyForm;
      router.push(
        "/flats" + "?" + createQueryStringFromObject(formFormatedData)
      );
      return;
    }
    delete formData.emailNotifyForm;
    let res = reqHook.doRequest(formFormatedData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="row">
        <div className="col-sm-12 col-md-6 col-lg-4 tw-pr-8 tw-pl-8">
          <CustomDropdown
            id="tip"
            label="Tip nekretnine"
            inputProps={register("type")}
            data={["Stan", "Kuca", "Soba", "Garaza", "Lokal"]}
            selectLabel="Izaberi tip nekretnine"
            validationError={errors.type}
          />
        </div>

        <div className="col-sm-12 col-md-6 col-lg-4 tw-pr-8 tw-pl-8">
          <CustomDropdown
            id="lokacija"
            label="Lokacija"
            inputProps={{
              ...register("city"),
              onChange: (e) => {
                setShouldMapRecenter(true); // your method
                register("city").onChange(e); // method from hook form register
              },
            }}
            data={townsWithLocations.map((town) => town.label)}
            selectLabel="Izaberi lokaciju"
            validationError={errors.city}
          />
        </div>
        <div className="col-sm-12 col-md-6 col-lg-4 tw-pr-8 tw-pl-8">
          <CustomDropdown
            id="kupovinaProdaja"
            label="Prodaja/Izdavanje"
            inputProps={{
              ...register("sellOrRent"),
              onChange: (e) => {
                if (e.target.value == "Izdavanje") {
                  setPrice([0, MAX_RENT_PRICE]); // your method
                  setPriceSliderMax(MAX_RENT_PRICE);
                } else {
                  setPrice([0, MAX_SELL_PRICE]); // your method
                  setPriceSliderMax(MAX_SELL_PRICE);
                }

                register("sellOrRent").onChange(e); // method from hook form register
              },
            }}
            data={["Prodaja", "Izdavanje"]}
            selectLabel="Izaberi prodaju ili izdavanje"
            validationError={errors.sellOrRent}
          />
        </div>

        <div className="col-sm-12  col-md-6 col-lg-4 tw-pr-8 tw-pl-8">
          <CustomDualSlider
            rtl={false}
            id="slider"
            measureUnit="€"
            min={0}
            max={priceSliderMax}
            step={watch("sellOrRent") == "Prodaja" ? 100 : 5}
            values={price}
            setValues={setPrice}
            label="Cena stana"
          />
        </div>
        <div className="col-sm-12 col-md-6 col-lg-4 tw-pr-8 tw-pl-8">
          <CustomDualSlider
            rtl={false}
            id="slider_surface"
            measureUnit="m2"
            min={0}
            max={500}
            step={1}
            values={surface}
            setValues={setSurface}
            label="Povrsina"
          />
        </div>
        {watch("type") != "Lokal" &&
          watch("type") != "Garaza" &&
          watch("type") != "Soba" && (
            <div className="col-sm-12 col-md-6 col-lg-4 tw-pr-8 tw-pl-8">
              <CustomDualSlider
                rtl={false}
                id="slider"
                measureUnit=""
                min={0}
                max={MAX_ROOMS_NUM}
                step={0.5}
                values={numberOfRooms}
                setValues={setNumberOfRooms}
                label="Broj soba"
              />
            </div>
          )}
        <div className="col-12 tw-pr-8 tw-pl-8 tw-mt-3">
          <CustomCheckbox
            id={"check_email"}
            label={
              "Set email notification. Be notified via email when new flat appers on the web."
            }
            inputProps={register("emailNotifyForm")}
          />
        </div>
        <div className="col-12 tw-pr-8 tw-pl-8 tw-mt-3">
          <CustomCheckbox
            id={"with_area"}
            label={"Draw area on the map for the search."}
            inputProps={register("with_area")}
          />
        </div>
      </div>

      {watch("with_area") && (
        <CustomMap
          center={
            townsWithLocations.find((town) => town.label == watch("city"))
              ?.location || [44.787197, 20.457273]
          }
          setAreaCoords={setAreaCoords}
          areaCoords={areaCoords}
          shouldMapRecenter={shouldMapRecenter}
          setShouldMapRecenter={setShouldMapRecenter}
        />
      )}

      <div className="tw-flex tw-justify-center tw-mt-5">
        <button className="btn btn-lg tw-bg-primary tw-text-text" type="submit">
          {watch("emailNotifyForm") ? "Set email notification" : "Find flats"}
        </button>
      </div>
    </form>
  );
}

export default FindFlatForm;
