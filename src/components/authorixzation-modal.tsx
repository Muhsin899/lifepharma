import React from "react";
import ModalContainer from "./ui/modal-container";
import { useState } from "react";
import { isValidPhoneNumber } from "react-phone-number-input";
import { useTimer } from "use-timer";
import { signIn } from "next-auth/react";
import { Button, buttonVariants } from "./ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./ui/command";
import { Input, inputVariants } from "./ui/input";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import OtpInput from "react-otp-input";
import { useModal } from "./ui/modalcontext";
import Link from "next/link";
import { useRouter } from "next/router";
import { Typography, typographyVariants } from "./ui/typography";
import { Icon } from "./ui/icons";
import { cn } from "@/lib/utils";
import InvalidOTPModal from "./invalid-otp-modal";
import countriesData from "../data/countries-data.json";
import { toast } from "sonner";

const AuthModal = () => {
  // const [isPhoneNumberValid, setPhoneNumberValidState] = useState<any>("");
  const [signInUsing, signInSet] = useState({ value: "", type: "" });
  // const [isEmailValid, setEmailValidState] = useState<any>(null);
  const [otpPageVisibility, setOtpPageVisibility] = useState(false);
  const [state, setState] = useState("");
  const [countDownVisible, setCountDownVisible] = useState(false);
  const handleChange = (state: string) => {
    setState(state);
    if (state.length === 4) {
      setTimeout(() => {
        otpIsValid(state);
      }, 200);
    }
  };
  const [phoneNumberforOTP, setPhoneNumberforOtp] = useState("");
  const [LoginSignUpPageVisibility, setLoginSignUpPageVisibility] =
    useState(true);

  const [notValidOTPPageVisib, setnotValidOTPPageVisib] = useState(false);
  const [credentialValidState, setCredentialValidState] = useState<any>({
    email: {
      state: null,
    },
    phone: {
      state: null,
    },
  });
  const [loadingState, setLoadingState] = useState(false);
  const { pathname } = useRouter();

  const {
    setSheetOpen,
    setaddNewAddress,
    setaddnewAddressFormVisibility,
    isSheetOpen,
    setLocationModal,
    isFixedModal,
    setTermsModal,
    setPrivacyPolicyModalState,
    countriesDrawerState,
    setCountriesDrawerState,
    selectedCountryData,
    setSelectedCountryData,
    locationOnClickHandle,
  } = useModal();

  const { time, start, pause, reset, status } = useTimer({
    initialTime: 59,
    timerType: "DECREMENTAL",
  });

  async function otpIsValid(otpValue: string) {
    debugger;
    setLoadingState(true);
    if (signInUsing.type === "phone") {
      const promise = new Promise(async (resolve) => {
        signIn("credentials", {
          phone: phoneNumberforOTP,
          code: otpValue,
          isPhone: "true",
          redirect: false,
        }).then(async (res) => {
          debugger;

          if (res?.ok) {
            setaddNewAddress(true);
            setSheetOpen(false);
          } else {
            setnotValidOTPPageVisib(true);
          }
          setLoadingState(false);

          resolve(res);
        });
      });
      toast.promise(promise, {
        loading: "Loading...",
        success: `OTP Verified Successfully`,
        error: "Error",
        className: "space-x-2 rtl:space-x-reverse",
      });
    } else {
      const promise = new Promise(async (resolve) => {
        await signIn("credentials", {
          email: phoneNumberforOTP,
          code: otpValue,
          isPhone: "false",
          redirect: false,
        }).then(async (res) => {
          if (res?.ok) {
            setaddNewAddress(true);

            setSheetOpen(false);
          } else {
            setnotValidOTPPageVisib(true);
          }

          setLoadingState(false);

          resolve(res);
        });
      });
      toast.promise(promise, {
        loading: "Loading...",
        success: `OTP Verified Successfully`,
        error: "Error",
        className: "space-x-2 rtl:space-x-reverse",
      });

      setCredentialValidState({
        email: {
          state: null,
        },
        phone: {
          state: null,
        },
      });
    }
  }

  function sendOTPRequest(credential: string, type: string) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw;
    if (type === "phone") {
      raw = JSON.stringify({
        phone: credential,
      });
    } else if (type === "email") {
      raw = JSON.stringify({
        email: credential,
      });
    }

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };
    setPhoneNumberforOtp(credential);
    fetch("/api/authorization", requestOptions)
      .then((response) => {
        debugger;
        if (!response.ok) {
          debugger;
          toast.error("Error", {
            description: "Something went wrong Please try again",
            className: "space-x-3 rtl:space-x-reverse",
          });
        } else {
          toast.success("Success", {
            description: "OTP Sent Successfully",
            className: "space-x-3 rtl:space-x-reverse",
          });
        }
      })
      .then((result) => console.log(result))
      .catch((error) => console.log("error while fetching search data", error));
  }

  const [phoneNumberValidTimeout, setPhoneNumberValidTimeout] =
    useState<any>(null);

  function isValidCredentials(credentialType: string, credentialValue: string) {
    // setPhoneNumberValidState("loading");
    setCredentialValidState((prevState: any) => ({
      ...prevState,
      [credentialType]: {
        state: "loading",
      },
    }));
    clearTimeout(phoneNumberValidTimeout);
    const timeout = setTimeout(() => {
      if (credentialValue != null || "") {
        if (
          (credentialType === "phone" &&
            isValidPhoneNumber("+" + credentialValue)) ||
          (credentialType === "email" &&
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
              credentialValue
            ))
        ) {
          signInSet({ type: credentialType, value: credentialValue });
          setCredentialValidState((prevState: any) => ({
            ...prevState,
            [credentialType]: {
              state: "success",
            },
          }));
        } else {
          setCredentialValidState((prevState: any) => ({
            ...prevState,
            [credentialType]: {
              state: "failed",
            },
          }));
        }
      } else {
        setCredentialValidState((prevState: any) => ({
          ...prevState,
          [credentialType]: {
            state: "failed",
          },
        }));
      }
    }, 400);
    setPhoneNumberValidTimeout(timeout);
  }

  function startTimer() {
    start();
    setCountDownVisible(true);
  }
  const stopTimer = () => {
    setCountDownVisible(false);
    reset();
    return 0;
  };

  function isValidPhoneNoInput(SetOtpVisb: boolean) {
    if (SetOtpVisb) {
      setLoginSignUpPageVisibility(false);
      setOtpPageVisibility(true);
      setState("");
      startTimer();

      sendOTPRequest(signInUsing.value, signInUsing.type);
    } else {
      setLoginSignUpPageVisibility(true);
      setOtpPageVisibility(false);
      stopTimer();
      setCredentialValidState({
        email: {
          state: null,
        },
        phone: {
          state: null,
        },
      });
    }
  }

  return (
    <>
      <ModalContainer
        size={"default"}
        showModal={isSheetOpen}
        setCloseModal={
          isFixedModal && pathname === "/checkout" ? () => {} : setSheetOpen
        }
      >
        {LoginSignUpPageVisibility ? (
          <form className="space-y-3 " action="#">
            <div className=" flex justify-center items-center pb-1 font-semibold ">
              <Typography
                size={"xxl"}
                bold={"bold"}
                alignment={"horizontalCenter"}
                variant={"primary"}
              >
                Login or Sign up
              </Typography>

              <button
                className="absolute right-5 top-6"
                onClick={() => {
                  isFixedModal ? () => {} : setSheetOpen(false);
                }}
              >
                <Icon type="crossIcon" className="" />
              </button>
            </div>
            <div className="mt-3 flex-1 ">
              <Tabs defaultValue="phone" className="border-none">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="phone" className="z-20">
                    <Typography bold={"semibold"}>Using Phone</Typography>
                  </TabsTrigger>
                  <TabsTrigger value="email">
                    <Typography bold={"semibold"}>Using Email</Typography>
                  </TabsTrigger>
                </TabsList>

                <TabsContent key="phoneinput" value="phone">
                  <div className="space-y-2">
                    <Typography bold={"semibold"} requiredField={true}>
                      Enter Your Mobile Number
                    </Typography>

                    <Input
                      sizes={"sm"}
                      buttonLeft={
                        <Button
                          onClick={(e) => {
                            e.preventDefault();
                            setCountriesDrawerState(true);
                          }}
                          variant={"normal"}
                          position={"inputLeftBtn"}
                          className=""
                        >
                          {selectedCountryData ? (
                            <>
                              {" "}
                              <Image
                                src={`https://hatscripts.github.io/circle-flags/flags/${selectedCountryData.alpha2Code.toLowerCase()}.svg`}
                                width="50"
                                height="50"
                                className={`sm:w-7 sm:h-7 h-6 w-6  `}
                                alt={selectedCountryData.name}
                              />
                              <Typography
                                className="px-2"
                                bold={"bold"}
                                size={"lg"}
                              >
                                {" "}
                                +{selectedCountryData.callingCodes}
                              </Typography>
                              <Icon
                                type="chevronBottomIcon"
                                className="text-black"
                              />
                            </>
                          ) : null}
                        </Button>
                      }
                      className={cn(
                        typographyVariants({
                          bold: "bold",
                          size: "lg",
                        })
                      )}
                      onChange={(e) =>
                        isValidCredentials(
                          "phone",
                          selectedCountryData.callingCodes + e.target.value
                        )
                      }
                      iconRight={
                        credentialValidState.phone.state === "loading" ? (
                          <Icon
                            variant={"inputIconRight"}
                            className={typographyVariants({
                              variant: "lifeText",
                            })}
                            type="loadingIcon"
                            animation={"spin"}
                          />
                        ) : credentialValidState.phone.state === "success" ? (
                          <Icon
                            type="checkIcon"
                            sizes={"lg"}
                            variant={"inputIconRight"}
                            className="fill-green-500 text-white"
                          />
                        ) : credentialValidState.phone.state === "failed" ? (
                          <Icon
                            type="errorIcon"
                            className="text-red-500"
                            variant={"inputIconRight"}
                          />
                        ) : null
                      }
                    />
                  </div>
                </TabsContent>
                <TabsContent key="emailInput" value="email">
                  <div className="space-y-2">
                    <Typography bold={"semibold"} requiredField={true}>
                      Enter Your Email Address
                    </Typography>

                    <Input
                      sizes={"sm"}
                      className={typographyVariants({
                        bold: "bold",
                        size: "lg",
                      })}
                      iconRight={
                        credentialValidState.email.state === "loading" ? (
                          <Icon
                            variant={"inputIconRight"}
                            className={typographyVariants({
                              variant: "lifeText",
                            })}
                            type="loadingIcon"
                            animation={"spin"}
                          />
                        ) : credentialValidState.email.state === "success" ? (
                          <Icon
                            type="checkIcon"
                            sizes={"lg"}
                            variant={"inputIconRight"}
                            className="fill-green-500 text-white"
                          />
                        ) : credentialValidState.email.state === "failed" ? (
                          <Icon
                            type="errorIcon"
                            className="text-red-500"
                            variant={"inputIconRight"}
                          />
                        ) : null
                      }
                      iconLeft={
                        <Icon
                          type="mailIcon"
                          variant={"inputIconLeft"}
                          className="text-slate-400"
                        />
                      }
                      iconSize={"lg"}
                      onChange={(e) => {
                        isValidCredentials("email", e.target.value);
                      }}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            <div className="space-y-2">
              <Typography size={"xs"}>
                By continuing, I agree to the{" "}
                <Button
                  variant="primaryLink"
                  size="xs"
                  onClick={(e) => {
                    e.preventDefault();
                    setTermsModal(true);
                  }}
                >
                  Terms of Use
                </Button>{" "}
                &{" "}
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    setPrivacyPolicyModalState(true);
                  }}
                  variant="primaryLink"
                  size="xs"
                >
                  Privacy Policy
                </Button>{" "}
              </Typography>

              <div className="flex space-x-2 rtl:space-x-reverse">
                {isFixedModal && pathname === "/checkout" ? (
                  <Link
                    href="/cart"
                    onClick={() => setSheetOpen(false)}
                    className={
                      "w-full sm:text-base text-sm " +
                      buttonVariants({ variant: "outline", size: "default" })
                    }
                  >
                    Back To Cart
                  </Link>
                ) : null}
                <Button
                  disableBtn={
                    credentialValidState.phone.state === "success" ||
                    credentialValidState.email.state === "success"
                      ? false
                      : true
                  }
                  className="w-full "
                  onClick={() => {
                    isValidPhoneNoInput(true);
                  }}
                >
                  PROCEED
                </Button>
              </div>
            </div>
          </form>
        ) : null}
        {otpPageVisibility ? (
          <div className="" id="otpPage">
            <div className="pb-2">
              <Typography
                bold={"semibold"}
                variant={"primary"}
                size={"xxl"}
                alignment={"horizontalCenter"}
                className="mb-1"
              >
                OTP Code
              </Typography>
              <Typography
                type="p"
                size={"sm"}
                requiredField={true}
                alignment={"horizontalCenter"}
                variant={"paragraph"}
              >
                Please check your {signInUsing.type} and enter the OTP code{" "}
              </Typography>
            </div>

            <form className="space-y-4" action="#">
              <OtpInput
                value={state}
                onChange={handleChange}
                containerStyle={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  marginLeft: "auto",
                  marginRight: "auto",
                  paddingTop: "0.5rem",
                  paddingBottom: "0rem",
                }}
                numInputs={4}
                inputStyle={{
                  width: "100%",
                  fontSize: "1.5rem",
                  paddingTop: "0.5rem",
                  paddingBottom: "0.5rem",
                }}
                renderSeparator={<span className="w-[7rem] "> </span>}
                renderInput={(props: any) => (
                  <input
                    {...props}
                    className={cn(
                      "!h-16 !rounded-md",
                      inputVariants({ sizes: "lg" })
                    )}
                  />
                )}
              />
              <div>
                {countDownVisible ? (
                  <div className="flex justify-between" id="seconds-count">
                    <Typography size={"sm"}>Didn't Receive Code?</Typography>{" "}
                    <Typography size={"sm"}>
                      Request again in {time >= 0 ? time : stopTimer()} seconds
                    </Typography>{" "}
                  </div>
                ) : (
                  <Button
                    variant={"outline"}
                    onClick={() => {
                      isValidPhoneNoInput(true);
                    }}
                    type="button"
                    size={"sm"}
                    className="!text-xs"
                    rounded={"md"}
                  >
                    Resend OTP
                  </Button>
                )}
              </div>
              <div className="flex space-x-3 rtl:space-x-reverse">
                <Button
                  onClick={() => {
                    isValidPhoneNoInput(false);
                  }}
                  variant={"outline"}
                  className="w-1/3"
                >
                  Back
                </Button>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    otpIsValid(state);
                  }}
                  className="w-full"
                  disabled={state.length === 4 ? false : true}
                  isLoading={loadingState}
                  iconLeft={
                    loadingState && (
                      <Icon
                        type="loadingIcon"
                        animation={"spin"}
                        sizes={"sm"}
                        className="mx-2"
                      />
                    )
                  }
                >
                  PROCEED
                </Button>
              </div>
            </form>
          </div>
        ) : null}
      </ModalContainer>

      <ModalContainer
        showModal={countriesDrawerState}
        setCloseModal={setCountriesDrawerState}
        size={"lg"}
      >
        <div className="pb-2">
          <Typography bold={"semibold"} size={"lg"}>
            Select a Country
          </Typography>
        </div>
        <Command className="rounded-lg border shadow-md ">
          <CommandInput placeholder="Search for Countries..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {selectedCountryData ? (
                <CommandItem className="bg-green-100 items-center flex justify-between pr-5">
                  <div
                    className="flex items-center cursor-pointer  py-1"
                    onClick={() => {
                      setCountriesDrawerState(false);
                    }}
                  >
                    <Image
                      src={`https://hatscripts.github.io/circle-flags/flags/${selectedCountryData.alpha2Code.toLowerCase()}.svg`}
                      width="50"
                      height="50"
                      className="w-8 h-8 mx-3"
                      alt={selectedCountryData.name}
                    />
                    <Typography size={"sm"}>
                      {selectedCountryData.name}
                    </Typography>
                    <Typography size={"sm"} bold={"semibold"}>
                      (+{selectedCountryData.callingCodes})
                    </Typography>
                  </div>
                  <Icon
                    type="checkIcon"
                    className="text-white fill-emerald-500"
                  />
                </CommandItem>
              ) : null}
              {countriesData
                ? countriesData.map((countr: any) => (
                    <CommandItem
                      className={` ${
                        selectedCountryData &&
                        selectedCountryData.name === countr.name
                          ? "hidden"
                          : ""
                      } `}
                    >
                      <div
                        className=" items-center flex pr-5 cursor-pointer py-1"
                        onClick={() => {
                          setSelectedCountryData(countr);
                          setCountriesDrawerState(false);
                        }}
                      >
                        <Image
                          src={`https://hatscripts.github.io/circle-flags/flags/${countr.alpha2Code.toLowerCase()}.svg`}
                          width="50"
                          height="50"
                          className="w-8 h-8 mx-3"
                          alt={countr.name}
                        />

                        <Typography size={"sm"}> {countr.name}</Typography>
                        <Typography size={"sm"} bold={"semibold"}>
                          (+{countr.callingCodes})
                        </Typography>
                      </div>
                    </CommandItem>
                  ))
                : null}
            </CommandGroup>
            <CommandSeparator />
          </CommandList>
        </Command>
      </ModalContainer>

      <InvalidOTPModal
        modalHeader="Invalid OTP Entered"
        modalMessage="Please try Again!"
        isWarning={false}
        showModal={notValidOTPPageVisib}
        setCloseModal={setnotValidOTPPageVisib}
        buttonProps={
          <Button
            className="mx-auto w-full"
            onClick={() => {
              setnotValidOTPPageVisib(false);
            }}
          >
            OK
          </Button>
        }
      />
    </>
  );
};

export default AuthModal;
