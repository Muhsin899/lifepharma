import { Button } from "./ui/button";
import { Icon } from "./ui/icons";
import { Input } from "./ui/input";
import { useModal } from "./ui/modalcontext";
import { Typography } from "./ui/typography";
import { useSession } from "next-auth/react";
import { isValidPhoneNumber } from "react-phone-number-input";
import Image from "next/image";
import countriesData from "../data/countries-data.json";
import { inputVariants } from "./ui/input";
import { useState, useRef } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";

import {
  SelectContainer,
  SelectOption,
  SelectOptionsContainer,
} from "./ui/select";
import { Globe } from "lucide-react";
const AddNewAddressForm = ({
  isModal,
  setCloseModal,
  getValues,
  handleSubmit,
  register,
  errors,
  setLocationMapVisbility,
  setaddnewAddressFormVisibility,
}: {
  isModal: boolean;
  setCloseModal?: any;
  getValues: any;
  handleSubmit: any;
  register: any;
  errors: any;
  setLocationMapVisbility?: any;
  setaddnewAddressFormVisibility?: any;
}) => {
  const { data: session, update } = useSession();
  const { countries } = useLanguage();
  const { currentLocation } = useModal();

  const {
    selectedCountryData,
    setCountriesDrawerState,
    formDataInitState,
    setFormData,
    formData,
  } = useModal();

  const listboxRef = useRef<any>(null);

  const deliveryOptions = ["Home", "Other"];

  const createdAndUpdatedData = () => {
    const currentDate = new Date();

    if (formData.id) {
      return {
        updated_at: currentDate.toISOString(),
      };
    } else {
      return {
        created_at: currentDate.toISOString(),
        updated_at: currentDate.toISOString(),
      };
    }
  };

  const addressFormOnSubmit = (data: any): void => {
    debugger;

    saveAddresstoDb({
      ...data,
      ...createdAndUpdatedData(),
      ...{
        phone:
          "+" +
          selectedCountryData.callingCodes +
          getValues("phone").replace(/\s/g, ""),
        latitude: currentLocation[0].toString(),
        longitude: currentLocation[1].toString(),
      },
    });
  };

  function saveAddresstoDb(formDatas: any) {
    debugger;
    console.log(formDatas);

    var requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.token.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formDatas),
    };
    fetch(
      `https://${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/user/save-address`,
      requestOptions
    )
      .then((response) => {
        debugger;
        if (response.ok) {
          debugger;

          setFormData(formDataInitState);
          return response.json();
        } else {
          throw new Error("Request failed");
        }
      })
      .then((result: any) => {
        const updatedAddress = session?.token.addresses.filter(
          (addr: any) => addr.id !== result.data.address.id
        );

        if (updatedAddress.length === session?.token.addresses.length) {
          update({
            addresses: [
              ...updatedAddress,
              { id: result.data.address.id, ...result.data.address },
            ],
          });
        } else {
          update({
            addresses: [...session?.token.addresses, result.data.address],
          });
        }

        if (isModal) {
          setCloseModal();
        } else {
          setaddnewAddressFormVisibility(false);
        }
      })
      .catch((error) => console.log("error while fetching search data", error));
  }

  return (
    <div className="relative  rounded-lg overflow-y-auto no-scrollbar bg-white">
      <div className="flex justify-between">
        <div className=" flex items-center space-x-3 rtl:space-x-reverse">
          {isModal && (
            <>
              <button
                onClick={() => {
                  debugger;
                  setaddnewAddressFormVisibility(false);

                  setLocationMapVisbility(true);

                  // setavailableAddresses(true);

                  setFormData(formDataInitState);
                }}
              >
                <Icon type="chevronLeftIcon" />
              </button>

              <Typography size={"lg"} variant={"lifeText"} bold={"bold"}>
                Your Address
              </Typography>
            </>
          )}
        </div>
        {isModal && (
          <button
            onClick={() => {
              setCloseModal();
              setFormData(formDataInitState);
            }}
          >
            <Icon type="crossIcon" className="text-slate-700" />
          </button>
        )}
      </div>

      <div className="  bg-white">
        <form
          className="space-y-3 pt-3"
          onSubmit={handleSubmit(addressFormOnSubmit)}
        >
          <div className="space-y-2">
            <div className="bg-life text-white text-xs w-fit rounded-md p-0.5 px-2">
              PERSONAL DETAILS
            </div>
            <Input
              sizes={"sm"}
              rounded={"sm"}
              {...register("name", {
                required: true,
              })}
              className={`${
                errors.name?.type === "required" ? "border-red-500" : ""
              }`}
              type="text"
              name="name"
              placeholder="Full Name *"
            />
            {errors.name?.type === "required" && (
              <Typography variant={"danger"} size={"sm"}></Typography>
            )}
          </div>
          <div>
            <Typography className="mb-1" bold={"semibold"}>
              Enter your mobile number <span className="text-red-500">*</span>
            </Typography>

            <Input
              sizes={"sm"}
              rounded={"sm"}
              {...register("phone", {
                required: true,
                validate: (value: any) =>
                  isValidPhoneNumber(
                    "+" + selectedCountryData.callingCodes + value
                  ),
              })}
              className={`font-semibold  leading-[1] !text-lg ${
                errors.phone?.type === "validate" ? "border-red-500" : ""
              }`}
              buttonLeft={
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    setCountriesDrawerState(true);
                  }}
                  variant={"normal"}
                  className="text-black"
                  position={"inputLeftBtn"}
                >
                  {selectedCountryData ? (
                    <>
                      {" "}
                      <Image
                        src={`https://hatscripts.github.io/circle-flags/flags/${selectedCountryData.alpha2Code.toLowerCase()}.svg`}
                        width="50"
                        height="50"
                        className={`sm:w-6 sm:h-6 h-6 w-6`}
                        alt={countriesData[0].name}
                      />
                      <Typography className="px-2" bold={"bold"} size={"lg"}>
                        {" "}
                        +{selectedCountryData.callingCodes}
                      </Typography>
                    </>
                  ) : null}
                </Button>
              }
            />
            {errors.phone?.type === "required" && (
              <Typography variant={"danger"} size={"xs"}>
                Phone Number is Required
              </Typography>
            )}
          </div>

          <div className="space-y-2 pt-2">
            <div className="bg-life text-white text-xs w-fit rounded-md p-0.5 px-2">
              ADDRESS DETAILS
            </div>

            <SelectContainer
              value={formData.type}
              setValue={(value: any) =>
                setFormData((prevData: any) => ({ ...prevData, type: value }))
              }
              ref={listboxRef}
              iconProps={
                <Icon
                  type={"homeIconMenu"}
                  sizes={"sm"}
                  className="text-slate-700"
                />
              }
            >
              <SelectOptionsContainer ref={listboxRef}>
                {deliveryOptions.map((person, personIdx) => (
                  <SelectOption
                    keyValueData={{ key: personIdx, value: person }}
                    ref={listboxRef}
                  >
                    <span>{person}</span>
                  </SelectOption>
                ))}
              </SelectOptionsContainer>
            </SelectContainer>
          </div>
          <div className="flex space-x-6 rtl:space-x-reverse">
            <Input
              rounded={"sm"}
              {...register("state", { required: true })}
              sizes={"sm"}
              className={`${
                errors.emirates?.type === "required" ? "border-red-500" : ""
              }`}
              placeholder="Emirates *"
              required
            />

            <Input
              rounded={"sm"}
              sizes={"sm"}
              {...register("city", { required: true })}
              placeholder="City *"
              required
            />
          </div>

          <Input
            rounded={"sm"}
            {...register("google_address", {
              required: true,
            })}
            sizes={"sm"}
            className={`${
              errors.google_address?.type === "required" ? "border-red-500" : ""
            }`}
            placeholder="Street Address *"
            required
          />

          <div className="flex space-x-6 rtl:space-x-reverse">
            <Input
              rounded={"sm"}
              {...register("flat_number", {
                required: true,
              })}
              sizes={"sm"}
              className={`${
                errors.flatorVilla?.type === "required" ? "border-red-500" : ""
              }`}
              placeholder="Flat / Villa *"
              required
            />
            <Input
              rounded={"sm"}
              {...register("building", {
                required: true,
              })}
              sizes={"sm"}
              className={`${
                errors.building?.type === "required" ? "border-red-500" : ""
              }`}
              placeholder="Building *"
              required
            />
          </div>

          <SelectContainer
            value={formData.country}
            setValue={(value: any) =>
              setFormData((prevData: any) => ({ ...prevData, country: value }))
            }
            ref={listboxRef}
            iconProps={<Globe className="w-5 h-5 text-blue-500" />}
          >
            <SelectOptionsContainer ref={listboxRef}>
              {countries.map((countryData, indx) => (
                <SelectOption
                  keyValueData={{ key: indx, value: countryData.country }}
                  ref={listboxRef}
                >
                  <span>{countryData.country}</span>
                </SelectOption>
              ))}
            </SelectOptionsContainer>
          </SelectContainer>
          <textarea
            {...register("additional_info", {
              required: false,
            })}
            rows={2}
            placeholder="Additional information (eg. Area, Landmark)"
            className={cn(
              inputVariants({ variant: "default", rounded: "sm" }),
              "placeholder:text-slate-400 placeholder:font-[200] placeholder:text-xs"
            )}
          ></textarea>

          <Button type="submit" className="w-full">
            SAVE ADDRESS
          </Button>
        </form>
      </div>
    </div>
  );
};

export { AddNewAddressForm };
