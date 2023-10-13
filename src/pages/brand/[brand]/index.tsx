import { ProductsPage } from "@/components/products-page";
import getBrandProductData from "@/lib/getBrandProductData";

export default function SingleBrand({
  brandsProductsData,
}: {
  brandsProductsData: any;
}) {
  return (
    <ProductsPage
      isBrandsPage={true}
      isSearchPage={false}
      categoryData={brandsProductsData}
      type={"products"}
    />
  );
}

// export async function getStaticPaths() {
//   return {
//     paths: [],
//     fallback: "blocking",
//   };
// }

export async function getServerSideProps(context: any) {
  const { params, locale } = context;

  const brandsProductsData = await getBrandProductData({
    brandName: params.brand,
    catSlug: params.singleCategory,
    filterPath: "",
    noOfProducts: 0,
    lang: locale,
    context,
  });
  return {
    props: {
      brandsProductsData: brandsProductsData.data,
    },
  };
}
