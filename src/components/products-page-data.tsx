import { SingleProductData } from "./single-product-data";
import React, { useState } from "react";
import { useRouter } from "next/router";
import getProductsDataByCat from "@/lib/getProductsDataByCat";
import { useLanguage } from "@/hooks/useLanguage";
import { ProductsSkeleton } from "./productsSkeleton";
import getBrandProductData from "@/lib/getBrandProductData";
import Link from "next/link";
import { useEffect } from "react";
import { Typography } from "./ui/typography";
import { ProductFilters } from "./product-filters";
import { useModal } from "./ui/modalcontext";
import InfiniteScroll from "react-infinite-scroll-component";
import { Icon } from "./ui/icons";
import { stringify } from "querystring";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";

const FiltersSection = dynamic(
  () => import("./category-filters").then((mod) => mod.FiltersSection),
  {
    ssr: false,
  }
);

const ProductsPageData = ({
  categoryData,
  brandsData,
  isSearchPage,
  isBrandsPage,
}: {
  isSearchPage: boolean;
  categoryData: any;
  brandsData: any;
  isBrandsPage: boolean;
}) => {
  const router = useRouter();
  const { query } = router;

  const [noOfProducts, setNoOfProducts] = useState(40);
  const [data, setData] = useState<any>([]);
  const [productFilterApplied, setProductsFilterApplied] = useState(false);
  const [isClientSideData, setIsClientSideData] = useState(false);
  const noOfProductsCurrently = isClientSideData
    ? data.length
    : categoryData.products.length;

  const [showMoreProductsbtn, setShowMoreProductsbtn] = useState(
    noOfProductsCurrently < categoryData.total_count
  );

  const { locale } = useLanguage();
  const { data: session } = useSession();
  // console.log(noOfProductsCurrently < categoryData.total_count);

  useEffect(() => {
    // setShowMoreProductsbtn(noOfProductsCurrently < categoryData.total_count);
    const handleRouteChange = () => {
      debugger;
      setData([]);
      setIsClientSideData(true);

      setProductsFilterApplied(true);
      fetchData(0, false, stringify(router.query));
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router]);

  const { selectedUserPrefernece } = useModal();

  function fetchData(
    noOfProducts: number,
    loadMoreData: boolean,
    filterPaths: string
  ) {
    if (!isBrandsPage) {
      debugger;
      getProductsDataByCat({
        filterPath: filterPaths,
        noOfProducts,
        lang: locale,
        clientSideSessionData: session,
      }).then((proData: any) => {
        if (loadMoreData) {
          debugger;
          setData((prevContent: any) => [
            ...prevContent,
            ...proData.data.products,
          ]);

          if (
            productsLength >
            categoryData.products.length + proData.data.products.length
          ) {
            setShowMoreProductsbtn(true);
          } else {
            setShowMoreProductsbtn(false);
          }
        } else {
          setData(proData.data.products);
          setProductsFilterApplied(false);
        }
      });
    } else {
      getBrandProductData({
        brandName: query.brand,
        catSlug: query.singleCategory ? query.singleCategory : "",
        filterPath: filterPaths,
        noOfProducts,
        lang: locale,
        clientSideSessionData: session,
      }).then((brandsProductsData: any) => {
        if (loadMoreData) {
          setData((prevContent: any) => [
            ...prevContent,
            ...brandsProductsData.data.products,
          ]);

          if (
            productsLength >
            categoryData.products.length +
              brandsProductsData.data.products.length
          ) {
            setShowMoreProductsbtn(true);
          } else {
            setShowMoreProductsbtn(false);
          }
        } else {
          setData(brandsProductsData.data.products);
          setProductsFilterApplied(false);
        }
      });
    }
  }

  function loadMoreProducts() {
    fetchData(noOfProducts, true, stringify(router.query));
    setNoOfProducts((c) => c + 40);
  }

  const productsLength = categoryData.total_count || noOfProducts;

  return (
    <div className=" max-w-[1450px] mx-auto  sm:px-[10px] px-[5px]">
      <ProductFilters
        noOfProductsCurrently={noOfProductsCurrently}
        productsLength={productsLength}
      />

      <div className="pb-24">
        <div className="grid grid-cols-1 gap-x-8  lg:grid-cols-4">
          {!isSearchPage && !isBrandsPage ? (
            <div>
              <FiltersSection brandsData={brandsData} />
            </div>
          ) : !isSearchPage ? (
            <div className="hidden lg:block space-y-2">
              <Typography bold={"bold"}>Category</Typography>
              {categoryData.categories.map((cat_data: any, indx: number) => (
                <div className="flex justify-between text-gray-800 text-sm">
                  <Link
                    href={`/brand/${query.brand}/${cat_data.slug}`}
                    className={`${
                      query.singleCategory
                        ? query.singleCategory === cat_data.slug
                          ? "text-blue-500"
                          : ""
                        : indx === 0
                        ? "text-blue-500"
                        : ""
                    } hover:text-blue-500`}
                  >
                    {cat_data.name}
                  </Link>
                  <div>{cat_data.count}</div>
                </div>
              ))}
            </div>
          ) : null}
          <div
            className={`${isSearchPage ? " col-span-full py-7" : "col-span-3"}`}
          >
            <InfiniteScroll
              scrollThreshold={0.9}
              dataLength={data.length ? data.length : 0}
              next={loadMoreProducts}
              hasMore={showMoreProductsbtn}
              loader={
                <div
                  className={`md:grid-cols-4   sm:gap-3 gap-1 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1  grid mt-3 ${
                    selectedUserPrefernece &&
                    selectedUserPrefernece.value === "row"
                      ? "!grid-cols-1 !gap-0"
                      : ""
                  }`}
                >
                  {Array(4).fill(<ProductsSkeleton />)}
                </div>
              }
            >
              <div
                className={`grid ${
                  selectedUserPrefernece &&
                  selectedUserPrefernece.value === "row"
                    ? "!grid-cols-1 !gap-0"
                    : ""
                } ${
                  isSearchPage
                    ? "xl:grid-cols-6 md:grid-cols-4 sm:grid-cols-3 "
                    : "  md:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1"
                }  xs:grid-cols-2 grid-cols-1 sm:gap-3 gap-1`}
              >
                {!isClientSideData ? (
                  categoryData.products.length > 0 ? (
                    categoryData.products.map((pro_data: any) => (
                      <SingleProductData
                        pro_data={pro_data}
                        isRowView={
                          selectedUserPrefernece?.value === "row" || false
                        }
                      />
                    ))
                  ) : (
                    <div className="w-full col-span-3">
                      <Typography
                        variant={"paragraph"}
                        className="py-2"
                        alignment={"horizontalCenter"}
                      >
                        No Products Found
                      </Typography>
                    </div>
                  )
                ) : null}

                {productFilterApplied && Array(12).fill(<ProductsSkeleton />)}

                {data.length > 0
                  ? data.map((pro_data: any) => (
                      <SingleProductData
                        pro_data={pro_data}
                        isRowView={
                          selectedUserPrefernece?.value === "row" || false
                        }
                      />
                    ))
                  : isClientSideData &&
                    !productFilterApplied && (
                      <div className="w-full col-span-3">
                        <Typography
                          variant={"paragraph"}
                          className="py-2"
                          alignment={"horizontalCenter"}
                        >
                          No Products Found
                        </Typography>
                      </div>
                    )}
              </div>
            </InfiniteScroll>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPageData;
