import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import AddtoCartMobileview from "./add-cart-mobile-view";
import ProductsSlider from "./products-slider";
import BreadCrumb from "./breadcrumb";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useCartActions } from "@/hooks/useCartActions";
import { Button, buttonVariants } from "./ui/button";
import { Typography, typographyVariants } from "./ui/typography";
import { cn } from "@/lib/utils";
import { AddOrEditCartBtn, ProductPricesData } from "./Button";
import { Icon } from "./ui/icons";
import { CategoriesSection, FeatureSection } from "./feature-section";
import {
  ProductBestSellerBadge,
  ProductOfferBadge,
  ProductRatingBadge,
  ProductWishList,
} from "./ui/badge";
import ProductImage from "./proImg-gallery";
import { useModal } from "./ui/modalcontext";
import { FrequentlyBroughtComp } from "./frequently-bought";
import { useLanguage } from "@/hooks/useLanguage";
import getFrequentlyBroughtTogetherData from "@/lib/frequentlyBroughtTogether";
import { AnimatedCheckMark } from "./animated-checkmark";
import { Pagination, Navigation, Autoplay, Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import ReviewsComp from "./reviews";

const SingleProductsContent = ({
  pro_data,
  relatedProductsData,
  reviewsData,
}: {
  pro_data: any;
  relatedProductsData: any;
  reviewsData: any;
}) => {
  const cartItems = useSelector((state: RootState) => state.cart);
  const { addWishList, removeWishList } = useCartActions();
  const wishListSet = (wishListState: boolean) => {
    debugger;
    !wishListState ? addWishList([pro_data]) : removeWishList(pro_data.id);
  };
  const cartItemsData = cartItems.cart.cart_data
    ? cartItems.cart.cart_data.items
    : [];

  const { AddressDataIndex, locationOnClickHandle } = useModal();

  const formatDate = (dateTimeString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    const formattedDate = new Date(dateTimeString).toLocaleString(
      "en-US",
      options
    );
    return formattedDate;
  };

  const getProductQuantity = (productId: any) => {
    const productItem = cartItemsData?.find((item: any) =>
      item.items[0].id === productId ? item.items[0].qty : null
    );
    return productItem ? productItem.items[0].qty : 1;
  };
  const { createCart } = useCartActions();

  const [readMorClick, setReadMoreCLick] = useState(false);

  const [proQty, setProQty] = useState<any>(1);
  const [cartItemsAddTimeoutState, setCartItemsAddTimeout] =
    useState<any>(null);

  const [loadingState, setLoadingState] = useState<boolean>(false);
  const [addedToCartItemData, setAddedToCartItemData] = useState<any>(null);
  const [frequentlyBroughtData, setFrequentlyBroughtData] = useState<any>(null);

  const [checkedProducts, setCheckedProducts] = useState<any>(null);
  const { locale, currentCountryDetails } = useLanguage();

  useEffect(() => {
    setProQty(getProductQuantity(pro_data.id));
    getFrequentlyBroughtTogetherData(pro_data.id, locale).then((res) => {
      res.data.products !== null
        ? setFrequentlyBroughtData([
            { proData: res.data.products },
            { proId: pro_data.id },
          ])
        : setFrequentlyBroughtData(null);
    });
  }, []);

  const cartInit: any = {
    action: "",
    data: {
      items: [],
      address_id: null,
    },
  };
  const clearCartState = () => {
    cartInit.data.items = [];
    cartInit.action = "";
  };

  const addedToCart = () => {
    debugger;
    clearTimeout(cartItemsAddTimeoutState);

    const timeout = setTimeout(() => {
      debugger;
      cartInit.data.items.push({ id: pro_data.id, qty: proQty });
      createCart(cartInit);
      clearCartState();
    }, 800);

    setCartItemsAddTimeout(timeout);
  };

  const swiperRef2 = useRef<SwiperType>();

  // console.log(frequentlyBroughtData);
  // // const { loading, setLoadingState } = useModal();

  const addToCart = () => {
    // setLoadingState("loadingStarted");
    checkedProducts.map((chPro: string) => {
      cartInit.data.items.push({ id: chPro, qty: 1 });
    });
    createCart(cartInit);

    setTimeout(() => {
      setFrequentlyBroughtData(null);
      setLoadingState(true);
    }, 700);

    // setFrequentlyBroughtData((data:any)=>data.state="checked")
  };

  return (
    <div className="container-page  md:text-sm sm:text-xs bg-white  pb-9">
      <BreadCrumb menuData={["Products", pro_data.title]} type={"products"} />
      <div>
        <div className="mx-auto  grid grid-cols-12 gap-x-5 my-2 ">
          {pro_data && (
            <>
              <div className="flex md:col-span-4 min-[570px]:col-span-6 col-span-full border-2 border-muted rounded-lg shadow-md p-2 h-fit lg:flex-row md:flex-col-reverse">
                <div className=" w-full  relative  bg-bottom col-span-full ">
                  <ProductImage
                    galleryImages={
                      pro_data.images.gallery_images.length > 1
                        ? pro_data.images.gallery_images
                        : [pro_data.images.featured_image]
                    }
                  />
                  <ProductBestSellerBadge proLabelData={pro_data.label} />
                  <div>
                    <ProductWishList
                      productId={pro_data.id}
                      iconSize={"default"}
                      wishListSet={wishListSet}
                    />
                  </div>
                </div>
              </div>

              <div className="  lg:mt-0 md:col-span-5 mt-3  min-[570px]:col-span-6 col-span-full">
                <Typography variant={"lifeText"} size={"lg"}>
                  {pro_data.title}
                </Typography>
                <ProductRatingBadge
                  productRating={pro_data.rating}
                  isProductPage={true}
                />

                <CategoriesSection categoriesData={pro_data.categories} />
                <div className="py-3  items-center justify-between sm:hidden flex">
                  <div className="space-y-2">
                    <ProductPricesData
                      productPrices={pro_data.prices}
                      productPriceSize={"xxl"}
                    />
                    <Typography size={"xs"} variant={"paragraph"}>
                      (VAT Inc.)
                    </Typography>
                  </div>
                  <Link
                    href={`/brand/${pro_data.brand.slug}`}
                    className="shadow-sm border border-muted max-h-[70px] max-w-[70px] rounded-lg "
                  >
                    <Image
                      src={pro_data.brand.images.logo}
                      height={60}
                      width={60}
                      alt="brand_img"
                    />
                  </Link>
                </div>
                <div className="border border-muted shadow-sm rounded-xl sm:hidden block">
                  <div className="   rounded-b-none ">
                    <div className="  items-center justify-between flex p-3">
                      <Typography variant={"paragraph"} size={"sm"}>
                        DELIVER TO {"  "}
                        <b>{AddressDataIndex?.google_address}</b>
                      </Typography>
                    </div>
                  </div>
                  <div className=" sm:hidden  flex items-center justify-between p-3 border-t rounded-xl rounded-t-none ">
                    <div className="  items-center justify-between flex ">
                      <div className="flex  items-center  space-x-2 ">
                        <Image
                          src="https://www.lifepharmacy.com/images/instant-nr.svg"
                          width={20}
                          height={22}
                          alt={"delivery-spped"}
                        />
                        <Typography size={"xs"} className="mx-2">
                          IN 30 MINS
                        </Typography>
                      </div>
                    </div>
                    <Button
                      variant={"primaryLink"}
                      onClick={() => locationOnClickHandle()}
                    >
                      CHANGE
                    </Button>
                  </div>
                </div>

                <div className=" justify-between py-4 hidden sm:flex">
                  <Typography variant={"lifeText"} size={"sm"}>
                    Brand:{" "}
                    <Link
                      className={buttonVariants({
                        variant: "primaryLink",
                        size: "sm",
                      })}
                      href={`/${pro_data.brand.brand_url}`}
                    >
                      {pro_data.brand.name}
                    </Link>
                  </Typography>
                  <div className="flex  items-center">
                    <Typography size={"xs"}>SKU: </Typography>
                    <Typography
                      variant={"lifeText"}
                      size={"xs"}
                      className="mx-1"
                    >
                      {pro_data.sku}
                    </Typography>
                  </div>
                </div>
                <div className="relative md:block hidden mb-10">
                  <div
                    className={cn(
                      typographyVariants({
                        variant: "paragraph",
                        size: "sm",
                        bold: "light",
                      }),
                      ` h-[5.5rem] !leading-6 ${
                        readMorClick
                          ? "from-white to-gray-200 overflow-y-auto"
                          : " overflow-y-hidden bg-gradient-to-b "
                      }`
                    )}
                    dangerouslySetInnerHTML={{
                      __html: pro_data.short_description,
                    }}
                  />
                  {readMorClick === false ? (
                    <div
                      className={`absolute -bottom-6 left-0 right-0 text-center ${
                        readMorClick
                          ? ""
                          : "bg-gradient-to-b from-transparent to-white "
                      } pt-16`}
                    >
                      <Button
                        onClick={() => setReadMoreCLick(true)}
                        variant={"primaryLink"}
                        size={"sm"}
                      >
                        Read More
                      </Button>
                    </div>
                  ) : null}
                </div>
                <div className="border-muted border rounded-lg mt-6 ">
                  <div className="  items-center p-2  border-b-2 border-gray-100 justify-between sm:flex hidden ">
                    <ProductPricesData
                      productPrices={pro_data.prices}
                      productPriceSize={"xxl"}
                    />
                    <div className="flex  items-center">
                      <Image
                        src={`https://www.lifepharmacy.com/images/${
                          pro_data.availability_new[0]
                            ? pro_data.availability_new[0].slot.shipment_label
                            : "standard"
                        }-nr.svg`}
                        alt="delivery-img"
                        width={25}
                        height={25}
                      />
                      <Typography
                        variant={"lifeText"}
                        size={"xs"}
                        className="mx-2"
                        lineClamp={"one"}
                      >
                        {/* 30 MINS */}
                        {(pro_data.availability_new[0] &&
                          pro_data.availability_new[0].slot.time) ||
                          "1 - 2 DAYS"}
                      </Typography>
                    </div>
                  </div>
                  <div className=" justify-center h-fit p-3 bg-gray  sm:flex hidden ">
                    <AddOrEditCartBtn
                      proId={pro_data.id}
                      isSingleProductPage={true}
                    />

                    <Button
                      className="w-full ltr:ml-3 rtl:mr-3"
                      rounded={"lg"}
                      size={"sm"}
                      onClick={() => addedToCart()}
                    >
                      <span className="flex items-center">
                        <Icon type="addToCartIcon" className="mx-1  " />
                        Add to Cart
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}

          <FeatureSection />
        </div>

        <div className="grid sm:grid-cols-2 grid-cols-1 gap-x-3 gap-y-3 py-5">
          <div>
            <Image
              width={700}
              height={200}
              src="https://lifeadmin-app.s3.me-south-1.amazonaws.com/mobile-app/homescreen/Product%20page%20banner/6dss-ppb.png"
              className="w-full"
              alt="featured-img-1"
            />
          </div>
          <div>
            <Image
              width={700}
              height={200}
              src="https://lifeadmin-app.s3.me-south-1.amazonaws.com/mobile-app/homescreen/Product%20page%20banner/Gluco-pp-aug-23.png"
              className="w-full"
              alt="featured-img-2"
            />
          </div>
        </div>
        {frequentlyBroughtData && (
          <div className="border border-muted shadow-sm rounded-lg rounded-b-none border-b-none  p-4 ">
            <div className="flex items-center justify-between ">
              <Typography size={"xl"} bold={"semibold"}>
                Frequently Bought Together
              </Typography>
              <div className="space-x-5  items-center md:flex hidden ">
                <div className="space-y-2">
                  <Typography
                    size={"sm"}
                    alignment={"horizontalCenter"}
                    className="text-slate-700"
                  >
                    Total Amount
                  </Typography>
                  <Typography
                    alignment={"horizontalCenter"}
                    variant={"lifeText"}
                    size={"sm"}
                    bold={"semibold"}
                  >
                    {currentCountryDetails.currency}{" "}
                    {frequentlyBroughtData[0].proData.reduce(
                      (accumulator: any, currentProduct: any) => {
                        return accumulator + Number(currentProduct.price);
                      },
                      0
                    )}
                  </Typography>
                </div>
                <Button
                  onClick={() => {
                    addToCart();
                  }}
                  className="p-4"
                  iconLeft={
                    <Icon type="plusIcon" sizes={"sm"} className="mx-1" />
                  }
                >
                  ADD ALL TO CART
                </Button>
              </div>
            </div>
            {frequentlyBroughtData && (
              <FrequentlyBroughtComp
                checkedProducts={checkedProducts}
                setCheckedProducts={setCheckedProducts}
                setAddedToCartItemData={setAddedToCartItemData}
                frequentlyBroughtData={frequentlyBroughtData}
                swiperRef={swiperRef2}
              />
            )}
            <div className="md:space-x-5  items-center md:hidden sm:flex block">
              <div className="space-y-2 sm:w-1/4 w-full sm:py-0 pb-3">
                <Typography
                  size={"sm"}
                  alignment={"horizontalCenter"}
                  className="text-slate-700"
                >
                  Total Amount
                </Typography>
                <Typography
                  alignment={"horizontalCenter"}
                  variant={"lifeText"}
                  size={"sm"}
                  bold={"semibold"}
                >
                  {currentCountryDetails.currency}{" "}
                  {frequentlyBroughtData[0].proData.reduce(
                    (accumulator: any, currentProduct: any) => {
                      return accumulator + Number(currentProduct.price);
                    },
                    0
                  )}
                </Typography>
              </div>
              <Button
                onClick={() => {
                  addToCart();
                }}
                className="p-4 sm:!w-3/4 w-full"
                iconLeft={
                  <Icon type="plusIcon" sizes={"sm"} className="mx-1" />
                }
              >
                ADD ALL TO CART
              </Button>
            </div>
          </div>
        )}
        {loadingState && (
          <div className="p-5 flex items-center justify-center">
            <div className="space-y-4">
              <AnimatedCheckMark />
              <Typography
                className="text-green-600"
                alignment={"horizontalCenter"}
                size={"lg"}
              >
                Added All Items to Cart
              </Typography>
            </div>
          </div>
        )}

        <div className="py-6 px-4 border border-muted">
          <h5 className="text-life-2 md:text-xl text-base font-semibold mb-2">
            Overview
          </h5>
          <div
            dangerouslySetInnerHTML={{ __html: pro_data.short_description }}
            className={cn(
              typographyVariants({
                variant: "paragraph",
                size: "sm",
                bold: "light",
              }),
              "  !leading-7 "
            )}
          />
        </div>
        <div className="py-6 px-4 border-x border-muted">
          <h5 className="text-life-2  md:text-xl text-base font-semibold mb-2 details-sec">
            Details
          </h5>
          <div
            dangerouslySetInnerHTML={{ __html: pro_data.description }}
            className={cn(
              typographyVariants({
                variant: "paragraph",
                size: "sm",
                bold: "light",
              }),
              "  !leading-6 "
            )}
          />
        </div>
        <div className="py-6 px-4 border border-muted">
          <h5 className="text-life-2 md:text-xl text-base font-semibold mb-2">
            More Info
          </h5>
          <div className="text-gray-500 text-xs">SKU: {pro_data.sku}</div>
        </div>

        <div className="lg:flex justify-around my-5 border-b border-muted py-6">
          <div className="lg:w-3/12 w-full lg:px-0 px-6 space-y-2">
            <Typography
              size={"xxl"}
              variant={"primary"}
              bold={"semibold"}
              className="p-2"
              alignment={"horizontalCenter"}
            >
              Product Rating
            </Typography>
            <Typography
              bold={"semibold"}
              size={"xl"}
              className="!text-4xl"
              alignment={"horizontalCenter"}
            >
              {pro_data.rating}
              <span className="text-gray-600 text-4xl">/5</span>
            </Typography>
            <div className="lg:w-1/2 w-1/4 mx-auto flex space-x-1 rtl:space-x-reverse justify-center">
              {Array(5).fill(
                <Icon
                  type="starIcon"
                  className="fill-amber-500 text-amber-500"
                  sizes={"sm"}
                />
              )}
            </div>

            <div>
              <Typography
                variant={"paragraph"}
                bold={"light"}
                alignment={"horizontalCenter"}
                size={"sm"}
              >
                Based on {pro_data.number_of_reviews} Ratings
              </Typography>
              {Array(5)
                .fill(null)
                .map((i, indx: number) => (
                  <div
                    className="bg-yellow-400 h-2.5 rounded-full block mb-1"
                    style={{ width: indx * 75 }}
                  ></div>
                ))}
            </div>
          </div>

          <ReviewsComp reviewsData={reviewsData} />
        </div>
      </div>

      <Typography bold={"semibold"} size={"xxl"} alignment={"horizontalCenter"}>
        You May Also Like
      </Typography>

      {relatedProductsData ? (
        <ProductsSlider proData={relatedProductsData} />
      ) : null}

      <AddtoCartMobileview
        addedToCart={addedToCart}
        salePrice={pro_data.sale_price}
        filterPrice={pro_data.filter_price}
        proQty={proQty}
        setProQty={setProQty}
      />
    </div>
  );
};

export default SingleProductsContent;
