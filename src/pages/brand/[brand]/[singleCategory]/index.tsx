import { ProductsPage } from "@/components/products-page";
import getBrandProductData from "@/lib/getBrandProductData";

export default function SingleBrandPage({
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
