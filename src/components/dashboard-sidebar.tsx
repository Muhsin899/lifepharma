import { SideBarMenuTranstion, TransitionComp } from "./ui/transition";

import { useModal } from "./ui/modalcontext";
import Image from "next/image";
import { Typography } from "./ui/typography";
import { Button } from "./ui/button";
import { Icon, IconProps } from "./ui/icons";
import { useState } from "react";
import {
  AccountDetailsComp,
  AddressComp,
  AppointmentsComp,
  DashboardComp,
  OrderComp,
  PrescriptionComp,
  ReturnOrdersComp,
  RewardsComp,
  VouchersComp,
  WalletComp,
} from "@/components/dashboard-components";
import { useRouter } from "next/router";
import InvalidOTPModal from "./invalid-otp-modal";
import { signOut, useSession } from "next-auth/react";
import { toast } from "sonner";
import { Verified } from "lucide-react";

type menuItems =
  | "dashboard"
  | "orders"
  | "returnOrders"
  | "prescrpition"
  | "addresses"
  | "accountDetails"
  | "wallet"
  | "appointments"
  | "wishlist"
  | "chatWithUs"
  | "Logout";

const DashboardSidebar = () => {
  const { dashboardSideBarState, setDashboardSideBarState } = useModal();
  const [menuItemVisiblity, setMenuItemVisiblity] = useState<any>(null);
  const [logOutWarningModal, setLogOutWarningModal] = useState(false);
  const [sideBarShrink, setsidebarShrinked] = useState(false);

  const router = useRouter();

  const { data: session } = useSession();

  interface menuItemProps {
    id: string;
    type?: string;
    name: string;
    onClick: () => void;
    iconType: IconProps["type"];
    component?: React.ReactNode;
  }

  const setActiveMenuItem = (menuItemName: menuItems) => {
    setMenuItemVisiblity(menuItemName);
  };

  const menuItems: menuItemProps[] = [
    {
      id: "addresses",
      name: "Addresses",
      onClick: () => {
        setActiveMenuItem("addresses");
      },
      iconType: "addressesIcon",
      component: <AddressComp />,
    },
    {
      id: "buyAgain",
      name: "Buy Again",
      onClick: () => {
        setActiveMenuItem("addresses");
      },
      iconType: "buyAgainIcon",
      component: <AddressComp />,
    },
    {
      id: "transactions",
      name: "Transactions",
      onClick: () => {
        setActiveMenuItem("addresses");
      },
      iconType: "transactionsIcon",
      component: <AddressComp />,
    },
    {
      id: "wishlist",
      name: "Wishlist",
      onClick: () => {
        router.push("/wishlist");
      },
      iconType: "wishlistIcon",
    },
    {
      id: "appointments",
      name: "Appointments",
      onClick: () => {
        setActiveMenuItem("appointments");
      },
      iconType: "appointmentsIcon",
      component: <AppointmentsComp />,
    },
    {
      id: "chatWithUs",
      name: "Contact Us",
      onClick: () => {
        setActiveMenuItem("chatWithUs");
      },
      iconType: "chatWithUsIcon",
    },

    {
      type: "all",

      id: "orders",
      name: "Orders",
      onClick: () => {
        setMenuItemVisiblity("orders");
      },
      iconType: "ordersIcon",
      component: <OrderComp />,
    },
    {
      type: "mainMenu",
      id: "vouchers",

      name: "Vouchers",
      onClick: () => {
        setMenuItemVisiblity("vouchers");
      },
      iconType: "giftsIcon",
      component: <VouchersComp />,
    },
    {
      type: "mainMenu",

      id: "rewards",
      name: "Rewards",
      onClick: () => {
        setMenuItemVisiblity("rewards");
      },
      iconType: "rewardsIcon",
      component: <RewardsComp />,
    },
  ];

  const logoutMenu: menuItemProps = {
    id: "Logout",
    name: "Log Out",
    onClick: () => {
      setLogOutWarningModal(true);
    },
    iconType: "LogoutIcon",
  };

  // {
  //   id: "dashboard",
  //   name: "Dashboard",
  //   onClick: () => {
  //     setActiveMenuItem("dashboard");
  //   },
  //   iconType: "homeIconMenu",
  //   component: <DashboardComp setActiveMenuItem={setActiveMenuItem} />,
  // },
  // {
  //   type: "all",

  //   id: "orders",
  //   name: "Orders",
  //   onClick: () => {
  //     setMenuItemVisiblity("orders");
  //   },
  //   iconType: "ordersIcon",
  //   component: <OrderComp />,
  // },
  // {
  //   id: "returnOrders",
  //   name: "Return Orders",
  //   onClick: () => {
  //     setActiveMenuItem("returnOrders");
  //   },
  //   iconType: "returnOrdersIcon",
  //   component: <ReturnOrdersComp />,
  // },
  // {
  //   id: "prescrpition",
  //   name: "Prescrpition",
  //   onClick: () => {
  //     setActiveMenuItem("prescrpition");
  //   },
  //   iconType: "prescriptionIcon",
  //   component: <PrescriptionComp />,
  // },

  // {
  //   id: "accountDetails",
  //   name: "Account Details",
  //   onClick: () => {
  //     setActiveMenuItem("accountDetails");
  //   },
  //   iconType: "accountDetailsIcon",
  //   component: <AccountDetailsComp />,
  // },
  // {
  //   id: "wallet",
  //   name: "Wallet",
  //   onClick: () => {
  //     setActiveMenuItem("wallet");
  //   },
  //   iconType: "walletIcon",
  //   component: <WalletComp />,
  // },

  return (
    <SideBarMenuTranstion
      isOpen={true}
      setIsClosed={setDashboardSideBarState}
      IsSideBarMenu={true}
    >
      <div className="bg-white p-6 flex items-center justify-between">
        <Typography size={"xxl"} bold={"semibold"}>
          My Account
        </Typography>
        <Icon type="crossIcon" className="text-slate-500" sizes={"lg"} />
      </div>
      <div className="w-full bg-gray-100 h-full space-y-5">
        <div className="w-full p-6 flex items-center justify-between bg-[#6785FC] rounded-b-3xl shadow-md">
          <div className="flex items-center space-x-3">
            <div className="w-[85px] h-[85px] rounded-full bg-slate-100"></div>

            <div className="space-y-1">
              <div className="flex items-center space-x-1.5">
                <Typography bold={"semibold"} variant={"secondary"} size={"xl"}>
                  Test Name
                </Typography>
                <Verified className="w-7 h-7 fill-white text-[#6785FC]" />
              </div>
              <div className="text-white ">
                <Typography bold={"light"}>97129292929</Typography>
                <Typography size={"sm"} bold={"light"}>
                  abdullah.k@life-me.com
                </Typography>
              </div>
            </div>
          </div>
          <Button variant={"white"} rounded={"lg"} className="text-black">
            edit
          </Button>
        </div>
        <div className="rounded-lg bg-white border border-slate-200 mx-6  space-y-6 pt-7">
          <div className="flex  items-center justify-between px-11">
            {menuItems.map(
              (menuItem) =>
                (menuItem.type === "mainMenu" || menuItem.type === "all") && (
                  <button className="space-y-2 ">
                    {" "}
                    <div className="rounded-full p-6 bg-[#6785FC] shadow space-y-1">
                      <Icon
                        type={menuItem.iconType}
                        className="fill-white text-white !w-7 !h-7"
                      />
                    </div>
                    <Typography
                      variant={"lifeText"}
                      bold={"semibold"}
                      alignment={"horizontalCenter"}
                    >
                      {menuItem.name}
                    </Typography>
                  </button>
                )
            )}
          </div>
          <div>
            {menuItems.map(
              (menuItem) =>
                menuItem.type === undefined &&
                menuItem.id !== "Logout" && (
                  <button
                    onClick={() => menuItem.onClick()}
                    className="hover:bg-slate-100 transition-colors duration-200 px-4 border-gray-100 border-t block w-full  bg-white last:rounded-b-lg"
                  >
                    <div className=" py-4 px-1.5 flex items-center justify-between ">
                      <div className="flex items-center space-x-5">
                        <Icon type={menuItem.iconType} className="text-life" />
                        <Typography variant={"lifeText"} bold={"semibold"}>
                          {menuItem.name}
                        </Typography>
                      </div>
                      <Icon
                        type="chevronRightIcon"
                        className="!w-5 !h-5 text-life"
                      />
                    </div>
                  </button>
                )
            )}
          </div>
        </div>
        <div className="mx-6">
          {
            <button
              onClick={() => logoutMenu.onClick()}
              className="hover:bg-slate-100 transition-colors duration-200 px-4 border-gray-200 border block w-full  bg-white mt-5 rounded-lg"
            >
              <div className=" py-4 px-1.5 flex items-center justify-between ">
                <div className="flex items-center space-x-5">
                  <Icon type={logoutMenu.iconType} className="text-life" />
                  <Typography variant={"lifeText"} bold={"semibold"}>
                    {logoutMenu.name}
                  </Typography>
                </div>
                <Icon type="chevronRightIcon" className="!w-5 !h-5 text-life" />
              </div>
            </button>
          }
        </div>
      </div>

      <InvalidOTPModal
        isWarning={true}
        showModal={logOutWarningModal}
        setCloseModal={setLogOutWarningModal}
        modalMessage="Are you sure you want to log out?"
        modalHeader="Logout"
        buttonProps={
          <div className="flex space-x-2 w-full rtl:space-x-reverse">
            <Button
              className="mx-auto w-full"
              onClick={() => {
                // router.push("/");
                signOut({ callbackUrl: "/" });
                toast.success("Success", {
                  className: "space-x-3 rtl:space-x-reverse",
                  description: "Log Out Successfull",
                });
              }}
            >
              OK
            </Button>
            <Button
              variant={"outline"}
              className="mx-auto w-full"
              onClick={() => {
                setLogOutWarningModal(false);
              }}
            >
              Cancel
            </Button>
          </div>
        }
      />
    </SideBarMenuTranstion>
  );
};

export { DashboardSidebar };
