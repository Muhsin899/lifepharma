import getSingleProductData from "@/lib/getSingleProductData";
import SingleProductsContent from "@/components/single-product-page";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const SingleProductPage = ({
  singleProductData,
  relatedProductsData,
  reviewsData,
}: {
  singleProductData: any;
  relatedProductsData: any;
  reviewsData: any;
}) => {
  return (
    <SingleProductsContent
      pro_data={singleProductData}
      relatedProductsData={relatedProductsData}
      reviewsData={reviewsData}
    />
  );
};

export default SingleProductPage;

// export async function getStaticPaths() {

//     return {
//         paths: [],
//         fallback: "blocking",
//     };
// }

export async function getServerSideProps(context: any) {
  const session = await getServerSession(context.req, context.res, authOptions);
  var requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Latitude: String(session?.token?.selected_address?.latitude || 25.192622),
      Longitude: String(session?.token?.selected_address?.longitude || 55.276383),
    },
  };

  const singleProductData = await getSingleProductData(
    context.locale,
    context.params.singleProduct,
    requestOptions
  );
  return {
    props: {
      singleProductData: singleProductData.data.product,
      relatedProductsData: singleProductData.data.related_products,
      reviewsData: singleProductData.data.product_reviews,
    },
  };
}
