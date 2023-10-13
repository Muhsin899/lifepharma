import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useLanguage } from "@/hooks/useLanguage";
import { Typography, typographyVariants } from "./ui/typography";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useModal } from "./ui/modalcontext";
import { Icon } from "./ui/icons";
const LgNavbarBottom = ({
  locationOnClickHandle,
}: {
  locationOnClickHandle: any;
}) => {
  const { t } = useLanguage();
  const { AddressDataIndex } = useModal();

  const displayAddress = () => {
    if (AddressDataIndex?.google_address) {
      return AddressDataIndex?.google_address;
    } else {
      return "Dubai, United Arab Emirates";
    }
  };

  return (
    <>
      <div className="bg-life-2 my-auto py-[1px] ">
        <div className="  justify-between  py-0.5 container-page  flex items-center">
          <Link
            href={"/super-summer-savers"}
            className={cn(
              "flex justify-start items-center",
              typographyVariants({ variant: "secondary" })
            )}
          >
            <Typography
              size={"sm"}
              lineClamp={"one"}
              bold={"light"}
              variant={"secondary"}
            >
              {t.navbar.highest_rated_phar}
              <span className=" mx-1.5 ">|</span>
            </Typography>
            <Image
              src={"https://www.lifepharmacy.com/images/app-rating.svg"}
              height={20}
              width={83}
              alt={"app-rating"}
              className="mb-[3px]"
            />

            <Typography
              size={"sm"}
              lineClamp={"one"}
              bold={"light"}
              variant={"secondary"}
            >
              <span className=" mx-1.5 ">|</span>
              Download Now
            </Typography>
          </Link>
          <div className="flex items-center ">
            <Typography
              lineClamp={"one"}
              size={"xs"}
              bold={"light"}
              className="max-w-[30rem] mx-2"
              variant={"secondary"}
            >
              <span className="font-semibold">{t.navbar.deliver_to}:</span>{" "}
              {displayAddress()}{" "}
            </Typography>
            <Button
  
              onClick={() => {
                locationOnClickHandle();
              }}
              iconLeft={
                <Icon
                  type="locationPinIcon"
                  className="ltr:mr-1 rtl:ml-1 !w-[10px]"
                  sizes={"sm"}
                />
              }
              iconType="locationPinIcon"
              variant="white"
              size={"xs"}
            >
              CHANGE
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LgNavbarBottom;
