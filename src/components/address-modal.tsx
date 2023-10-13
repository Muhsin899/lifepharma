import ModalContainer from "./ui/modal-container";
import React, { useRef, useState, useMemo } from "react";
import { useModal } from "./ui/modalcontext";
import { Typography } from "./ui/typography";
import { Button } from "./ui/button";
import { Icon } from "./ui/icons";
import { useForm } from "react-hook-form";
import { AddNewAddressForm } from "./addnewAddressForm";
import { ArrowLeft, MapPinIcon, Map as Maps, Navigation } from "lucide-react";
import { useSession } from "next-auth/react";
import { GoogleMap, useLoadScript } from "@react-google-maps/api";
import { getReverseGeoCodingApiData } from "@/helpers/getReverseGeoCodingApiData";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio";
import { useRouter } from "next/router";
import { formatPhoneNumber } from "react-phone-number-input";
import Image from "next/image";
import { Skeleton } from "./ui/skeleton";
import { Input } from "./ui/input";
import { useDebouncedCallback } from "use-debounce";

const AddressModal = () => {
  const [locationMapVisibility, setLocationMapVisbility] = useState(false);
  const [automCompleteVisibility, setAutomCompleteVisibility] = useState(false);
  // const [formData, setFormData] = useState<any>(null);
  const [searchBoxQuery, setSearchBoxQuery] = useState<any>(null);
  const [loadingState, setLoadingState] = useState(false);
  const { update, data: session } = useSession();
  const libraries = useMemo(() => ["places"], []);
  const router = useRouter();

  const [mapref, setMapRef] = React.useState<any>(null);

  const handleOnLoad = (map: any) => {
    debugger;
    setMapRef(map);
    if (!loadingState) {
      getGeoCodingData(currentLocation[0], currentLocation[1]);
    }
  };

  // console.log(mapref);

  const handleCenterChanged = () => {
    setLoadingState(true);
    if (mapref) {
      const newCenter = mapref.getCenter();

      getGeoCodingData(newCenter.lat(), newCenter.lng());
      setSelectedLocation([newCenter.lat(), newCenter.lng()]);
      setCurrentLocationFocus(false);
    }
  };

  // const [placeData, setPlaceData] = useState<any>(null);

  const {
    setaddNewAddress,
    addNewAddress,
    setAddressDataIndex,
    AddressDataIndex,
    availableAddresses,
    setavailableAddresses,
    setaddnewAddressFormVisibility,
    addnewAddressFormVisibility,
    locationOnClickHandle,
    addNewAddressClick,
    setAddNewAddressClick,
    currentLocation,
    selectedLocation,
    setSelectedLocation,
    formData,
    detectUserLocation,
    setFormData,
  } = useModal();

  function setCloseModal() {
    setaddNewAddress(false);
    setTimeout(() => {
      setaddnewAddressFormVisibility(false);
      setLocationMapVisbility(false);
    }, 200);
  }

  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    values: formData,
  });

  const [focusLocation, setCurrentLocationFocus] = useState(true);
  const [autoCompleteData, setAutocompletData] = useState<any>(null);

  const inputRef = useRef(null);

  const getGeoCodingData = (lat: string | number, lng: string | number) => {
    debugger;
    getReverseGeoCodingApiData(lat, lng).then((res) => {
      setFormData((prevData: any) => ({
        ...prevData,
        ...res,
      }));

      setSearchBoxQuery({ google_address: res.google_address, area: res.area });
      setLoadingState(false);
    });
  };

  const debounced = useDebouncedCallback((value) => {
    getSearchResults(value);
  }, 1000);

  const getSearchResults = (query: string) => {
    fetch(`/api/autoCompleteApi?input=${query}`)
      .then((res) => res.json())
      .then((data) => {
        setAutocompletData(data.predictions);
      });
  };

  const placeClicked = (placeId: string) => {
    debugger;
    fetch(`/api/getCordinates?place_id=${placeId}`)
      .then((res) => res.json())
      .then((data) => {
        debugger;
        let { lat, lng } = data.result.geometry.location;

        setLocationMapVisbility(true);

        setAutomCompleteVisibility(false);

        setLoadingState(true);

        getGeoCodingData(lat, lng);
        setSelectedLocation([lat, lng]);
      });
  };

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: libraries as any,
  });

  return (
    <ModalContainer
      size={"xl"}
      showModal={addNewAddress && session?.token.addresses ? true : false}
      setCloseModal={setCloseModal}
    >
      {addNewAddressClick &&
      session?.token.addresses &&
      session?.token.addresses.length === 0 ? (
        <div className=" bg-white rounded-lg   overflow-y-auto no-scrollbar min-h-fit  max-h-[calc(80vh-1rem)] ">
          <div className="space-y-6">
            <Maps className="w-20 h-20" />
            <div className="py-5">
              <Typography bold={"bold"} size={"xl"}>
                You have no saved Addresses
              </Typography>
              <p className="text-gray-400 text-sm py-1">
                Start by adding a new address
              </p>
            </div>
          </div>
          <div className="flex items-center rtl:space-x-reverse space-x-2 border-t border-gray-200 rounded-b  sticky bottom-0">
            <Button
              className="w-full"
              onClick={() => {
                setAddNewAddressClick(false);
                setLocationMapVisbility(true);
              }}
            >
              ADD NEW ADDRESS
            </Button>
          </div>
        </div>
      ) : null}
      {addnewAddressFormVisibility ? (
        <AddNewAddressForm
          isModal={true}
          setCloseModal={setCloseModal}
          getValues={getValues}
          setLocationMapVisbility={setLocationMapVisbility}
          handleSubmit={handleSubmit}
          register={register}
          errors={errors}
          setaddnewAddressFormVisibility={setaddnewAddressFormVisibility}
        />
      ) : null}

      {automCompleteVisibility && (
        <div>
          <div className="flex space-x-5 py-2 items-center">
            <Icon type="chevronLeftIcon" />
            <Input
              ref={inputRef}
              onChange={(e) => {
                debounced(e.target.value);
              }}
              className="bg-slate-50"
              inputClassName="bg-slate-50"
              sizes={"sm"}
              iconLeft={
                <Icon
                  variant={"inputIconLeft"}
                  type="searchIcon"
                  sizes={"sm"}
                  className="text-slate-500  "
                />
              }
              iconRight={
                <button className="bg-slate-400 p-0.5 rounded-full">
                  <Icon type="crossIcon" sizes={"xs"} className="text-white" />
                </button>
              }
            />
          </div>
          <div className="py-3 ">
            <Typography size={"sm"} className="mb-3 text-slate-600">
              SEARCH RESULTS
            </Typography>
            {autoCompleteData && autoCompleteData.length > 0 ? (
              autoCompleteData.map((ad: any) => (
                <button
                  onClick={() => placeClicked(ad.place_id)}
                  className="p-2  flex items-center w-full space-x-5 border-b-slate-100 border-b hover:bg-slate-50 rounded-lg hover:border-b-white"
                >
                  <Icon type="locationPinIcon" sizes={"sm"} />
                  <div className="space-y-1">
                    <Typography bold={"semibold"} size={"sm"}>
                      {ad?.structured_formatting.main_text}
                    </Typography>
                    <Typography variant={"paragraph"} size={"xs"}>
                      {ad?.structured_formatting.secondary_text}
                    </Typography>
                  </div>
                </button>
              ))
            ) : (
              <div className="h-60"></div>
            )}
          </div>
        </div>
      )}

      {locationMapVisibility && (
        <div className="space-y-3 relative">
          {/* <div className="pb-3">
            <div className="flex justify-between items-center pb-3">
              <div className=" flex space-x-3 items-center">
                <button
                  onClick={() => {
                    locationOnClickHandle();
                    setLocationMapVisbility(false);
                  }}
                >
                  <Icon type="chevronLeftIcon" className="text-slate-700" />
                </button>
                <Typography bold={"semibold"} variant={"lifeText"}>
                  Enter Location
                </Typography>
              </div>
              <button onClick={() => setCloseModal()}>
                <Icon type="crossIcon" className="text-slate-700" />
              </button>
            </div>
            <div className="w-full relative z-[10000] " ref={inputRef}>
             
            </div>
          </div> */}

          <div className="w-[97%] absolute top-3 inset-x-0 m-auto z-[1]">
            {/* <Autocomplete
         
              onLoad={(place: google.maps.places.Autocomplete) => {
                setPlaceData(place);
              }}
              
              onPlaceChanged={() => {
                if (mapref) {
                  setSelectedLocation([
                    placeData.getPlace().geometry.location.lat(),
                    placeData.getPlace().geometry.location.lng(),
                  ]);
                  setCurrentLocationFocus(false);
                  getGeoCodingData(
                    placeData.getPlace().geometry.location.lat(),
                    placeData.getPlace().geometry.location.lng()
                  );
                }
              }}
            >
              <Input
                value={searchBoxQuery}
                className="w-full"
                sizes={"sm"}
   
                iconRight={
                  <Icon
                    type="crossIcon"
                    className="m-auto"
                    sizes={"sm"}
                    onClick={() => setSearchBoxQuery("")}
                  />
                }
                onChange={(e) => {
                  setSearchBoxQuery((e.target as HTMLInputElement).value);
                }}
              />
            </Autocomplete> */}
            {/* <div className="rounded-md p-2 flex space-x-3 shadow items-center bg-white">
              <Icon
                type="locationPinIcon"
                className="text-slate-500"
                sizes={"sm"}
              />
              <div>
                <Typography
                  bold={"bold"}
                  className="text-slate-500"
                  size={"sm"}
                >
                  {searchBoxQuery}
                </Typography>
                <Typography className="text-slate-500" size={"sm"}>
                  Dubai
                </Typography>
              </div>
            </div> */}
          </div>
          <GoogleMap
            mapContainerStyle={{
              width: "100%",
              height: "350px",
            }}
            options={{
              disableDefaultUI: true,
            }}
            onDragEnd={handleCenterChanged}
            center={{
              lat: Number(selectedLocation[0]),
              lng: Number(selectedLocation[1]),
            }}
            zoom={20}
            onLoad={handleOnLoad}
          >
            <Image
              src={"/images/pin-map.png"}
              height={"50"}
              width={"50"}
              alt="location-pin"
              className="z-[1] absolute inset-x-0 m-auto top-[130px]"
            />

            <div className="absolute inset-x-0 m-auto z-[1] w-fit top-[167px]">
              <span className="relative flex h-5 w-5 ">
                <span className="animate-ping absolute duration-1000 inline-flex h-full w-full rounded-full bg-black/30"></span>
                <span className="relative inline-flex rounded-full h-5 w-5 bg-black/40"></span>
              </span>
            </div>

            <button
              className="z-[1] absolute right-6 bottom-6 scale-110  bg-white backdrop-blur-sm rounded-full  shadow-md p-3 cursor-pointer"
              onClick={() => {
                if (mapref) {
                  // setSelectedLocation(currentLocation);
                  setCurrentLocationFocus(true);
                }
                detectUserLocation();
              }}
            >
              <Navigation
                className={`w-5 h-5 m-auto text-blue-500 ${
                  focusLocation ? "fill-blue-500" : ""
                }`}
              />
            </button>
          </GoogleMap>
          <div className="bg-white  space-y-4">
            <div className="space-y-2">
              <Typography size={"sm"} variant={"paragraph"}>
                SELECT DELIVERY LOCATION
              </Typography>
              <div className="flex justify-between items-center ">
                <div className="flex space-x-2 items-center">
                  <Icon type="locationPinIcon" sizes={"sm"} />

                  {searchBoxQuery && !loadingState ? (
                    <Typography bold={"bold"} size={"lg"}>
                      {searchBoxQuery.area}
                    </Typography>
                  ) : (
                    <Typography bold={"semibold"} size={"lg"}>
                      Please wait...
                    </Typography>
                  )}
                </div>
                <Button
                  variant={"outline"}
                  size={"sm"}
                  rounded={"sm"}
                  onClick={() => {
                    setLocationMapVisbility(false);
                    setAutomCompleteVisibility(true);
                  }}
                  className=" leading-5"
                >
                  CHANGE
                </Button>
              </div>

              <div className="space-y-1">
                {searchBoxQuery && !loadingState ? (
                  <>
                    <Typography
                      size={"sm"}
                      variant={"paragraph"}
                      bold={"light"}
                      className="w-3/4"
                    >
                      {searchBoxQuery.google_address}
                    </Typography>
                    <Typography size={"sm"} variant={"paragraph"}>
                      {searchBoxQuery.area}
                    </Typography>
                  </>
                ) : (
                  <>
                    <Skeleton className="w-3/4 p-2 rounded " />
                    <Skeleton className="w-2/4 p-2 rounded " />
                  </>
                )}
              </div>
            </div>

            <Button
              className="w-full"
              rounded={"sm"}
              onClick={() => {
                if (formData.latitude !== undefined || "") {
                  setavailableAddresses(false);
                  setLocationMapVisbility(false);
                  setaddnewAddressFormVisibility(true);
                }
              }}
            >
              CONFIRM LOCATION
            </Button>
          </div>
        </div>
      )}

      {session && session.token.addresses.length > 0 && availableAddresses ? (
        <div className=" overflow-y-auto overflow-x-hidden  no-scrollbar  min-h-fit  max-h-[calc(80vh-1rem)]">
          <div className="w-full flex justify-between pb-2 items-center">
            <div className="flex space-x-2 rtl:space-x-reverse items-center">
              <Icon
                type="locationPinIcon"
                className="text-white fill-red-400"
              />
              <Typography size={"lg"} bold={"bold"} variant={"lifeText"}>
                Addresses
              </Typography>
            </div>

            <Button
              onClick={() => {
                setavailableAddresses(false);
                setLocationMapVisbility(true);
              }}
            >
              Add New Address
            </Button>
          </div>
          <RadioGroup onValueChange={(value) => setAddressDataIndex(value)}>
            <div className="rounded-lg p-3 bg-slate-50 border-2 border-muted">
              <div className="rounded-full p-1 px-2 bg-violet-100">
                <Typography size={"xs"} bold={"bold"}>
                  AVAILABLE ADDRESSES
                </Typography>
              </div>
              {session?.token.addresses.map((addr: any, indx: number) => (
                <label
                  htmlFor={addr.id}
                  className={`
                    relative flex cursor-pointer p-2 ${
                      indx != session?.token.addresses.length - 1
                        ? " border-muted border-b-2 focus:outline-none"
                        : ""
                    }`}
                >
                  <div className="flex w-full justify-between">
                    <div className="flex items-center">
                      <div className="text-sm flex space-x-7 rtl:space-x-reverse">
                        <div className="flex space-x-3 rtl:space-x-reverse items-start">
                          <RadioGroupItem
                            id={addr.id}
                            value={addr}
                            checked={AddressDataIndex.id === addr.id}
                          />
                          <table className="table-auto">
                            <tbody>
                              <tr>
                                <td className="table-data ">
                                  <Typography size={"xs"}>NAME</Typography>
                                </td>
                                <td className="table-data">
                                  <Typography size={"xs"} bold={"semibold"}>
                                    {" "}
                                    {addr.name}
                                  </Typography>
                                </td>
                              </tr>
                              <tr>
                                <td className="table-data">
                                  <Typography size={"xs"}>ADDRESS</Typography>
                                </td>
                                <td className="table-data">
                                  <Typography
                                    size={"xs"}
                                    bold={"semibold"}
                                    lineClamp={"one"}
                                  >
                                    {" "}
                                    {addr.google_address}
                                  </Typography>
                                </td>
                              </tr>
                              <tr>
                                <td className="table-data">
                                  <Typography size={"xs"}>PHONE</Typography>
                                </td>
                                <td className="table-data">
                                  <Typography size={"xs"} bold={"semibold"}>
                                    {" "}
                                    {addr.phone}
                                  </Typography>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                    <Button
                      variant={"closeBtn"}
                      size={"sm"}
                      className="shrink-0 text-life cursor-pointer p-0"
                      onClick={() => {
                        // setValue("name", addr.name);
                        // setValue("phone", addr.phone);
                        // setValue("type", addr.type);
                        // setValue("state", addr.state);
                        // setValue("city", addr.city);
                        // setValue("google_address", addr.google_address);
                        // setValue("flat_number", addr.flat_number);
                        // setValue("building", addr.building);
                        // setValue("country", addr.country);
                        // setValue("additional_info", addr.additional_info);

                        setFormData({
                          ...addr,
                          phone: formatPhoneNumber(`+${addr.phone}`),
                        });
                        setavailableAddresses(false);
                        // setaddnewAddressFormVisibility(true);
                        setLocationMapVisbility(true);
                      }}
                    >
                      <Icon type="editIcon" sizes={"xs"} />
                    </Button>
                  </div>
                </label>
              ))}
            </div>
          </RadioGroup>

          <div className="w-full bg-white pt-3 sticky bottom-0 leading-tight">
            <Button
              type="submit"
              className="w-full"
              onClick={() => {
                debugger;
                update({ selected_address: AddressDataIndex }).then((res) => {
                  setAddressDataIndex(AddressDataIndex);
                  setCloseModal();
                  router.reload();
                });
              }}
            >
              CONFIRM ADDRESS
            </Button>
          </div>
        </div>
      ) : null}
    </ModalContainer>
  );
};

export default AddressModal;
