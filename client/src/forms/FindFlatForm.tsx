"use client";

import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import CustomDropdown from "../components/CustomDropdown";
import CustomDualSlider from "../components/CustomDualSlider";
import CustomCheckbox from "../components/CustomCheckbox";
import { useRequest } from "../hooks/useRequest";
import { RootContext } from "../context/RootProvider";

function FindFlatForm(props) {
  let {
    handleSubmit,
    watch,
    formState: { errors },
    register,
  } = useForm();

  let reqHook = useRequest(
    "http://localhost:4000/api/flats/email-notification",
    "post"
  );

  let [price, setPrice] = useState([0, 500000]);
  let [surface, setSurface] = useState([0, 500]);

  let router = useRouter();

  const createQueryStringFromObject = (obj: any) => {
    const params = new URLSearchParams();
    Object.keys(obj).forEach((key) => {
      params.set(key, obj[key]);
    });
    return params.toString();
  };

  const onSubmit = async (formData) => {
    console.log(createQueryStringFromObject(formData));

    if (!formData.emailNotifyForm) {
      delete formData.emailNotifyForm;
      router.push(
        "/flats" +
          "?" +
          createQueryStringFromObject({
            ...formData,
            surfaceUnit: "m2",
            currency: "€",
            price_min: price[0],
            price_max: price[1],
            surface_min: surface[0],
            surface_max: surface[1],
          })
      );
      return;
    }
    delete formData.emailNotifyForm;
    let res = reqHook.doRequest({
      ...formData,
      surfaceUnit: "m2",
      currency: "€",
      price_min: price[0],
      price_max: price[1],
      surface_min: surface[0],
      surface_max: surface[1],
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="row">
        <div className="col-sm-12 col-md-6 col-lg-4 tw-pr-8 tw-pl-8">
          <CustomDropdown
            id="tip"
            label="Tip nekretnine"
            inputProps={register("type")}
            data={["Stan", "Kuca", "Soba", "Garaza"]}
            selectLabel="Izaberi tip nekretnine"
            validationError={errors.type}
          />
        </div>

        <div className="col-sm-12 col-md-6 col-lg-4 tw-pr-8 tw-pl-8">
          <CustomDropdown
            id="lokacija"
            label="Lokacija"
            inputProps={register("city")}
            data={["beograd", "Novi Sad", "Sabac", "Nis"]}
            selectLabel="Izaberi lokaciju"
            validationError={errors.city}
          />
        </div>
        <div className="col-sm-12 col-md-6 col-lg-4 tw-pr-8 tw-pl-8">
          <CustomDropdown
            id="kupovinaProdaja"
            label="Prodaja/Izdavanje"
            inputProps={register("sellOrRent")}
            data={["Prodaja", "Izdavanje"]}
            selectLabel="Izaberi prodaju ili izdavanje"
            validationError={errors.sellOrRent}
          />
        </div>
        <div className="col-sm-12 col-md-6 col-lg-4 tw-pr-8 tw-pl-8">
          <CustomDropdown
            id="broj_soba"
            label="Broj soba"
            inputProps={register("numberOfRooms")}
            data={["1"]}
            selectLabel="Izaberi broj soba"
            validationError={errors.numberOfRooms}
          />
        </div>
        <div className="col-sm-12  col-md-6 col-lg-4 tw-pr-8 tw-pl-8">
          <CustomDualSlider
            rtl={false}
            id="slider"
            measureUnit="€"
            min={0}
            max={500000}
            step={100}
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
        <div className="col-12 tw-pr-8 tw-pl-8 tw-mt-3">
          <CustomCheckbox
            id={"check_email"}
            label={
              "Set email notification. Be notified via email when new flat appers on the web."
            }
            inputProps={register("emailNotifyForm")}
          />
        </div>
      </div>

      <div className="tw-flex tw-justify-center tw-mt-5">
        <button className="btn btn-lg tw-bg-primary tw-text-text" type="submit">
          {watch("emailNotifyForm") ? "Set email notification" : "Find flats"}
        </button>
      </div>
    </form>
  );
}

export default FindFlatForm;
