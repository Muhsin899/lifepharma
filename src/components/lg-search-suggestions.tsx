import Image from "next/image";
import { Typography } from "./ui/typography";
import { Button } from "./ui/button";
import {
  CategoriesSkeleton,
  ProductsSkeleton,
  SugesstionsSkeleton,
} from "./skeletons";
import { Icon } from "./ui/icons";
import { useModal } from "./ui/modalcontext";
import { AddOrEditCartBtn, ProductPricesData } from "./Button";
import { History } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

export default function LgSearchSuggestions({
  searchData,
  close,
}: {
  searchData: any;
  close: any;
}) {
  const OfferType = (offer_type: string, offerValue: number) => {
    switch (offer_type) {
      case "flat_percentage_discount":
        return `${offerValue}`;
      default:
        return "";
    }
  };

  const { searchSuggestions, redirect } = useModal();

  const productsData = searchData?.results[0].hits || null;
  const suggestionsData = searchData?.results[1]?.hits || null;
  const brandsData = searchData?.results[2]?.hits || null;
  const categoriesData = searchData?.results[3]?.hits || null;

  const localStorageData = JSON.parse(
    localStorage.getItem("recent-searches") || "[]"
  );

  return (
    <div className="h-[calc(100vh_-_100px)] md:shadow-xl shadow-none md:px-3 px-1  bg-white  rounded-t-0 rounded-b-md z-50 border-t-1 border-muted space-y-4 py-4 ">
      {localStorageData.length > 0 && (
        <div className="space-y-1">
          <Typography variant={"lifeText"} bold={"semibold"}>
            Recent Searches
          </Typography>

          <div className="flex  flex-wrap  group-search  overflow-y-auto line-clamp-1">
            {localStorageData.map((recentSearchData: any) => (
              <Button
                size={"sm"}
                onClick={() => redirect(recentSearchData.slug)}
                iconLeft={
                  <History className="ltr:mr-2 rtl:ml-2 text-slate-400 h-5 w-5" />
                }
                rounded={"sm"}
                variant={"normal"}
                className="h-fit text-life py-1.5 mr-2 mt-2"
              >
                {recentSearchData.title}
              </Button>
            ))}
          </div>
        </div>
      )}
      <>
        <div className="group-search bg-white space-y-1">
          <>
            <Typography variant={"lifeText"} bold={"semibold"}>
              Trending Searches
            </Typography>
            <div className="flex  flex-wrap  group-search  line-clamp-2">
              {suggestionsData ? (
                <>
                  {suggestionsData.map((sug_data: any) => (
                    <Button
                      size={"sm"}
                      iconLeft={
                        <Icon
                          sizes={"sm"}
                          type="trendingIcon"
                          className="ltr:mr-2 rtl:ml-2 text-slate-400 "
                        />
                      }
                      rounded={"sm"}
                      onClick={() => {
                        searchSuggestions(
                          `/search?term=${sug_data.query}`,
                          sug_data.query
                        );
                      }}
                      variant={"normal"}
                      className="h-fit text-life py-2 mr-3 mt-2.5 "
                    >
                      {sug_data.query}
                    </Button>
                  ))}
                </>
              ) : (
                <SugesstionsSkeleton noOfSuggestions={5} />
              )}
            </div>
          </>
        </div>

        <div className="space-y-1">
          <Typography variant={"lifeText"} bold={"semibold"}>
            Trending Categories
          </Typography>
          <div className="grid grid-cols-2 gap-x-4 ">
            {categoriesData ? (
              <>
                {categoriesData.map((catData: any) => (
                  <Button
                    size={"sm"}
                    iconLeft={
                      <Image
                        className=" rounded-full mr-3 border-2 border-slate-200"
                        src={
                          catData?.images?.logo ||
                          "/images/default-product-image.png"
                        }
                        height={"40"}
                        width={"40"}
                        alt={catData.name}
                      />
                    }
                    onClick={() =>
                      searchSuggestions(
                        `/category/${catData.slug}`,
                        catData.name
                      )
                    }
                    rounded={"lg"}
                    variant={"normal"}
                    className="h-fit w-full text-life  mr-2 mt-2 justify-start bg-white border-slate-200 border hover:border-opacity-0 hover:bg-slate-100 py-1.5"
                  >
                    <span className="font-[500]">{catData.name}</span>
                  </Button>
                ))}
              </>
            ) : (
              <CategoriesSkeleton noOfSuggestions={5} />
            )}
          </div>
        </div>

        <div className="space-y-3">
          <Typography variant={"lifeText"} bold={"semibold"}>
            Trending Brands
          </Typography>
          <div className="grid grid-cols-6  gap-3">
            {brandsData ? (
              <>
                {brandsData.map((brandData: any) => (
                  <div className="banner-overlay">
                    <button
                      onClick={() =>
                        searchSuggestions(
                          `/brand/${brandData.slug}`,
                          brandData.name
                        )
                      }
                    >
                      {/* <span className="leading-[0px]">{brandData.name}</span> */}
                      <Image
                        className="border border-slate-100 rounded mr-auto"
                        src={
                          brandData?.images?.logo ||
                          "/images/default-product-image.png"
                        }
                        height={"80"}
                        width={"80"}
                        alt={brandData.name}
                      />
                    </button>
                  </div>
                ))}
              </>
            ) : (
              Array(6).fill(<Skeleton className="w-full p-10 rounded" />)
            )}
          </div>
        </div>

        <div className="text-gray-600 group-search  space-y-1">
          <Typography variant={"lifeText"} bold={"semibold"}>
            Products
          </Typography>
          <div className="overflow-y-auto lg:h-[calc(43vh_-_0px)] h-[calc(35vh_-_30px)]">
            {productsData ? (
              productsData.map((pro_data: any) => (
                <>
                  {" "}
                  <div className="p-2 rounded-lg   group-search hover:bg-gray-100 group w-full h-16  cursor-pointer  flex justify-between items-center ">
                    <div
                      onClick={() => {
                        searchSuggestions(
                          `/product/${pro_data.slug}`,
                          pro_data.title
                        );
                      }}
                      className="flex justify-between"
                    >
                      <div className="flex space-x-3 rtl:space-x-reverse items-center">
                        <Image
                          src={
                            pro_data.images
                              ? pro_data.images.featured_image
                              : "/images/default-product-image.png"
                          }
                          height={50}
                          width={50}
                          alt={pro_data.title}
                          className="border-2 rounded border-muted"
                        ></Image>
                        <div className="flex flex-col space-y-1  ">
                          <Typography size={"sm"} lineClamp={"two"}>
                            {pro_data.title}{" "}
                          </Typography>
                          <div className="flex space-x-2 rtl:space-x-reverse items-center">
                            <ProductPricesData
                              productPriceSize={"sm"}
                              productPrices={pro_data.prices}
                            />

                            {pro_data.search_offer &&
                            pro_data.search_offer.label &&
                            pro_data.search_offer.type ? (
                              <div className="bg-amber-200 w-fit text-[10px] py-0.5 px-2 h-fit   rounded">
                                {OfferType(
                                  pro_data.search_offer.type,
                                  pro_data.search_offer.label
                                )}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                    <AddOrEditCartBtn
                      proId={pro_data.id}
                      isSingleProductPage={false}
                    />
                  </div>
                </>
              ))
            ) : (
              <ProductsSkeleton noOfSuggestions={5} />
            )}

            {productsData && productsData.length === 0 ? (
              <div className="mx-auto w-fit p-2 flex flex-col space-y-3">
                <Image
                  src="/images/no-products-found.png"
                  alt="no-search-results"
                  width={250}
                  height={250}
                  className="mx-auto"
                />
                <Typography variant={"ghost"} alignment={"horizontalCenter"}>
                  Oops! Products Not Found
                </Typography>
                <Button
                  iconLeft={
                    <Icon
                      type="chatIcon"
                      sizes={"sm"}
                      variant={"inputIconLeft"}
                    />
                  }
                  iconType="chatIcon"
                  className="mx-auto"
                  rounded={"sm"}
                >
                  {" "}
                  Chat With Us
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </>
      {/* ) : (
      <div role="status" className="max-w-full animate-pulse">
        <div className="group-search mb-5 pt-4 space-y-2">
          <Typography variant={"primary"} size={"sm"} bold={"semibold"}>
            SUGGESTIONS
          </Typography>

          <div className="flex  flex-wrap">
            <SugesstionsSkeleton noOfSuggestions={5} />
          </div>
          <div className="group-search text-xs text-gray-600 space-y-3">
            <Typography variant={"primary"} bold={"semibold"} size={"sm"}>
              PRODUCTS
            </Typography>

            <ProductsSkeleton noOfSuggestions={10} />
          </div>
        </div>
      </div>
      ) */}
    </div>
  );
}
