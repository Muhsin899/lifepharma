import { useSession } from "next-auth/react";
import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import getSearchDataSuggsetions from "@/lib/getSearchData";
import { useWindowDimensions } from "@/hooks/useWindowDimensions";
import { useRouter } from "next/router";
import { getReverseGeoCodingApiData } from "@/helpers/getReverseGeoCodingApiData";
import { useDebouncedCallback } from "use-debounce";

type ModalContextState = {
  locationModalState: boolean;
  setLocationModalState: Dispatch<SetStateAction<boolean>>;
  setSheetOpen: Dispatch<SetStateAction<boolean>>;
  setaddNewAddress: Dispatch<SetStateAction<boolean>>;
  setaddnewAddressFormVisibility: Dispatch<SetStateAction<boolean>>;
  isSheetOpen: boolean;
  locationModal: boolean;
  setLocationModal: Dispatch<SetStateAction<boolean>>;
  addNewAddress: boolean;
  setAddressDataIndex: Dispatch<SetStateAction<any>>;
  AddressDataIndex: any;
  availableAddresses: boolean;
  setavailableAddresses: Dispatch<SetStateAction<boolean>>;
  isPhoneNumberValid: boolean;
  setPhoneNumberValidState: Dispatch<SetStateAction<boolean>>;
  setFormData: Dispatch<SetStateAction<any>>;
  formData: any;
  formDatahandleChange: any;
  isFixedModal: boolean;
  searchButtonOnClick: (isOpen: boolean) => void;
  searchData: any;
  setModalFixedState: Dispatch<SetStateAction<boolean>>;
  SearchLoadingState: boolean;
  queryData: string;
  searchButtonOnMouseEnter: any;
  smScreenSearchBox: any;
  setSmScreenSearchBox: Dispatch<SetStateAction<boolean>>;
  setQueryData: Dispatch<SetStateAction<string>>;
  searchBoxClear: any;
  searchClosebtn: boolean;
  selectedUserPrefernece: any;
  setUsersPreference: any;
  setTermsModal: any;
  termsModalState: any;
  setPrivacyPolicyModalState: any;
  PrivacyPolicyModalState: any;
  OrderSucessSheetState: boolean;
  setOrderSucessSheetState: Dispatch<SetStateAction<boolean>>;
  setFrequentlyBroughtData: Dispatch<SetStateAction<any>>;
  setLoadingState: Dispatch<SetStateAction<string>>;
  loading: string;
  frequentlyBroughtData: any;
  countriesDrawerState: boolean;
  setCountriesDrawerState: Dispatch<SetStateAction<boolean>>;
  setSelectedCountryData: Dispatch<SetStateAction<any>>;
  selectedCountryData: any;
  formDataInitState: any;
  lgSearchBoxSuggestionState: boolean;
  setLgSearchBoxSuggestionState: Dispatch<SetStateAction<boolean>>;
  addNewAddressClick: boolean;
  setAddNewAddressClick: Dispatch<SetStateAction<boolean>>;
  locationOnClickHandle: () => void;
  searchSuggestions: (url: string, title: string) => void;
  addnewAddressFormVisibility: boolean;
  currentLocation: any;
  setCurrentLocation: any;
  selectedLocation: any;
  setSelectedLocation: any;
  detectUserLocation: any;
  getLocationByIp: any;
  setCurrentCordinates: any;
  redirect: any;
  setDashboardSideBarState: Dispatch<SetStateAction<boolean>>;
  dashboardSideBarState: boolean;
};

const ModalContext = createContext<ModalContextState | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};

export const ModalProvider = ({ children }: { children: any }) => {
  const { data: session, update } = useSession();
  const router = useRouter();

  const [locationModalState, setLocationModalState] = useState(false);
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [locationModal, setLocationModal] = useState(false);
  const [addNewAddress, setaddNewAddress] = useState(false);
  const [addnewAddressFormVisibility, setaddnewAddressFormVisibility] =
    useState(false);

  const [availableAddresses, setavailableAddresses] = useState(false);
  const [isPhoneNumberValid, setPhoneNumberValidState] = useState(false);
  const [AddressDataIndex, setAddressDataIndex] = useState<any>(null);
  const [isFixedModal, setModalFixedState] = useState(false);
  const [queryData, setQueryData] = useState("");
  const [searchClosebtn, setVisibility] = useState(false);
  const [searchTimer, setSearchTimer] = useState<any>(null);
  const [SearchLoadingState, setSearchLoadingState] = useState(false);
  const [smScreenSearchBox, setSmScreenSearchBox] = useState(false);
  const [selectedUserPrefernece, setUsersPreference] = useState<any>(null);
  const { width } = useWindowDimensions();
  const [termsModalState, setTermsModal] = useState(false);
  const [PrivacyPolicyModalState, setPrivacyPolicyModalState] = useState(false);
  const [OrderSucessSheetState, setOrderSucessSheetState] = useState(false);
  const [frequentlyBroughtData, setFrequentlyBroughtData] = useState<any>(null);
  const [loading, setLoadingState] = useState("");
  const [countriesDrawerState, setCountriesDrawerState] = useState(false);
  const [dashboardSideBarState, setDashboardSideBarState] = useState(false);
  const [selectedCountryData, setSelectedCountryData] = useState<any>({
    name: "United Arab Emirates",
    alpha2Code: "AE",
    callingCodes: ["971"],
    independent: false,
  });
  // const [addressData, setAddressData] = useState<any>(null);
  const [lgSearchBoxSuggestionState, setLgSearchBoxSuggestionState] =
    useState(false);
  const [addNewAddressClick, setAddNewAddressClick] = useState(false);

  const [currentLocation, setCurrentLocation] = useState<any>([
    25.192622, 55.276383,
  ]);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);

  // console.log(AddressDataIndex);

  const [searchData, setData] = useState<any>(null);
  const searchSuggestions = (url: string, title: string) => {
    debugger;

    console.log(url, title);

    const localStorageData = JSON.parse(
      localStorage.getItem("recent-searches") || "[]"
    );

    const ifItemExist = localStorageData.some(
      (recentSearchData: any) => recentSearchData.title === title
    );

    if (!ifItemExist) {
      localStorage.setItem(
        "recent-searches",
        JSON.stringify([...localStorageData, { title: title, url: url }])
      );
    }

    router.push(url);
    if (width > 767) {
      setLgSearchBoxSuggestionState(false);
    } else {
      setSmScreenSearchBox(false);
    }
  };

  const searchButtonOnClick = (isOpen: boolean) => {
    if (window.innerWidth > 767) {
      // }
    } else {
      setSmScreenSearchBox(true);
    }
    searchButtonOnMouseEnter(queryData);
  };

  const searchBoxClear = () => {
    if (width > 575) {
      (document.getElementById("lg-searchbox") as HTMLInputElement).value = "";
    } else {
      (document.getElementById("sm-searchbox") as HTMLInputElement).value = "";
    }

    setQueryData("");
    searchButtonOnMouseEnter("");
    setVisibility(false);
  };

  const debounced = useDebouncedCallback((query: string) => {
    setSearchLoadingState(true);
    getSearchDataSuggsetions(query).then((res) => {
      // debugger
      setData(res);
      setSearchLoadingState(false);
    });
  }, 600);

  const getSearchData = (query: string) => {
    debounced(query);
  };

  function searchButtonOnMouseEnter(query: string) {
    setQueryData(query);

    clearTimeout(searchTimer);

    const newTimer = setTimeout(() => {
      getSearchData(query);
    }, 600);

    setSearchTimer(newTimer);

    if (query != "") {
      setVisibility(true);
    } else {
      setVisibility(false);
    }
  }

  const formDataInitState = {
    type: "Home",
    country: "United Arab Emirates",
    area: "Satwa",
    suitable_timing: "morning",

    belongs_to: "user",
    deleted_at: null,
    is_validated: 1,
  };

  const redirect = (pathname: string) => {
    router.push(pathname);
  };

  const [formData, setFormData] = useState(formDataInitState);

  const setCurrentCordinates = (lat: number, lng: number) => {
    setLocationCordinates(lat, lng);

    getReverseGeoCodingApiData(lat, lng).then((res) => {
      // debugger;
      localStorage.setItem("geoLocation", JSON.stringify(res));
      setAddressDataIndex(res);
    });
    // router.reload();
  };

  const setLocationCordinates = (lat: number, lng: number) => {
    setCurrentLocation([lat, lng]);
    setSelectedLocation([lat, lng]);
  };

  const getLocationByIp = () => {
    try {
      fetch("https://ipwho.is/")
        .then((res) => res.json())
        .then((res) => {
          setCurrentCordinates(res.latitude, res.longitude);
        });
    } catch (err) {
      setCurrentCordinates(25.192622, 55.276383);
    }
  };

  const getLocationFromLocalStorage = () => {
    setAddressDataIndex(JSON.parse(localStorage.getItem("geoLocation") || ""));
    const { latitude, longitude } = JSON.parse(
      localStorage.getItem("geoLocation") || ""
    );
    setLocationCordinates(latitude, longitude);
    // setCurrentCordinates(latitude, longitude);
  };

  const detectUserLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentCordinates(
            position.coords.latitude,
            position.coords.longitude
          );
          // router.reload();
        },
        (error) => {
          getLocationByIp();
          // router.reload();
        }
      );
    }
  };

  // useEffect(() => {
  //   debugger;
  //   if (session?.token.token) {
  //     debugger;

  //     getSessionDataAddress(session?.token.token).then((res) => {
  //       debugger;
  //       if (!session.token.selected_address) {
  //         if (res.data.addresses.length > 0) {
  //           debugger;
  //           update({ selected_address: res.data.addresses[0] });
  //           setAddressDataIndex(res.data.addresses[0]);
  //           const { latitude, longitude } = res.data.addresses[0];
  //           setCurrentCordinates(latitude, longitude);
  //         } else {
  //           if (localStorage.getItem("geoLocation")) {
  //             getLocationFromLocalStorage();
  //           } else {
  //             detectUserLocation();
  //           }
  //           // getReverseGeoCodingApiData(
  //           //   currentLocation[0],
  //           //   currentLocation[1]
  //           // ).then((res) =>
  //           //   update({
  //           //     selected_address: {
  //           //       ...res,
  //           //     },
  //           //   })
  //           // );
  //         }
  //         setAddressData(res.data.addresses);
  //       } else {
  //         debugger;
  //         setAddressData(res.data.addresses);
  //         const { latitude, longitude } = session?.token.selected_address;
  //         setCurrentCordinates(latitude, longitude);

  //         setAddressDataIndex(session?.token?.selected_address);
  //       }

  // if (addNewAddress) {
  //   // locationOnClickHandle();
  //   if (res.data.addresses.length > 0) {
  //     setavailableAddresses(true);
  //   } else {
  //     setAddNewAddressClick(true);
  //   }
  // }
  //     });
  //   } else {
  //     if (localStorage.getItem("geoLocation")) {
  //       getLocationFromLocalStorage();
  //     }
  //   }
  // }, [session?.token.token]);

  useEffect(() => {
    // debugger;

    if (session?.token.token) {
      // debugger;
      if (session.token.addresses.length > 0) {
        if (session.token.selected_address) {
          setAddressDataIndex(session.token.selected_address);
          setLocationCordinates(
            session.token.selected_address.latitude,
            session.token.selected_address.longitude
          );
        } else {
          debugger;
          setAddressDataIndex(session.token.addresses[0]);
          setLocationCordinates(
            session.token.addresses[0].latitude,
            session.token.addresses[0].longitude
          );
        }
      } else {
        detectUserLocation();
      }

      if (addNewAddress) {
        // locationOnClickHandle();
        if (session.token.addresses.length > 0) {
          setavailableAddresses(true);
        } else {
          setAddNewAddressClick(true);
        }
      }
    } else {
      if (localStorage.getItem("geoLocation")) {
        getLocationFromLocalStorage();
      } else {
        const defaultAddress = {
          new_method: true,
          language: "en",
          country: "ae",
          type: "default",
          latitude: 25.095437,
          longitude: 55.152684,
          label: "Dubai, United Arab Emirates",
          dismiss: true,
        };
        setAddressDataIndex(defaultAddress);
        setLocationCordinates(
          defaultAddress.latitude,
          defaultAddress.longitude
        );
        localStorage.setItem("geoLocation", JSON.stringify(defaultAddress));
      }
    }
  }, [session?.token.token]);

  const formDatahandleChange = (e: any): void => {
    const { name, value } = e.target;

    setFormData((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // console.log(AddressDataIndex);

  const locationOnClickHandle = () => {
    debugger;
    if (session != null) {
      if (session.token.addresses) {
        setaddNewAddress(true);

        if (session.token.addresses.length > 0) {
          setavailableAddresses(true);
        } else if (session.token.addresses.length === 0) {
          setAddNewAddressClick(true);
        }
      }
    } else {
      setLocationModalState(true);
    }
  };

  const contextValue: ModalContextState = {
    locationModalState,
    setLocationModalState,
    setSheetOpen,
    setaddNewAddress,
    setaddnewAddressFormVisibility,
    isSheetOpen,
    locationModal,
    setLocationModal,
    addNewAddress,
    setAddressDataIndex,
    AddressDataIndex,
    availableAddresses,
    setavailableAddresses,
    isPhoneNumberValid,
    setPhoneNumberValidState,
    setFormData,
    formData,
    formDatahandleChange,
    isFixedModal,
    setModalFixedState,
    searchButtonOnClick,
    searchData,
    SearchLoadingState,
    queryData,
    searchButtonOnMouseEnter,
    smScreenSearchBox,
    setSmScreenSearchBox,
    setQueryData,
    searchBoxClear,
    searchClosebtn,
    setUsersPreference,
    selectedUserPrefernece,
    termsModalState,
    setTermsModal,
    setPrivacyPolicyModalState,
    PrivacyPolicyModalState,
    OrderSucessSheetState,
    setOrderSucessSheetState,
    frequentlyBroughtData,
    setFrequentlyBroughtData,
    setLoadingState,
    loading,
    countriesDrawerState,
    setCountriesDrawerState,
    selectedCountryData,
    setSelectedCountryData,
    formDataInitState,
    lgSearchBoxSuggestionState,
    setLgSearchBoxSuggestionState,
    searchSuggestions,
    addNewAddressClick,
    setAddNewAddressClick,
    locationOnClickHandle,
    addnewAddressFormVisibility,
    currentLocation,
    setCurrentLocation,
    selectedLocation,
    setSelectedLocation,
    detectUserLocation,
    getLocationByIp,
    setCurrentCordinates,
    redirect,
    dashboardSideBarState,
    setDashboardSideBarState,
  };

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
    </ModalContext.Provider>
  );
};
