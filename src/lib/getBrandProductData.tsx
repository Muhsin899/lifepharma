import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

export default async function getBrandProductData({
  brandName,
  catSlug,
  filterPath,
  noOfProducts,
  lang,
  context,
  clientSideSessionData,
}: {
  brandName: any;
  catSlug: any;
  filterPath: string;
  noOfProducts: number;
  lang: any;
  context?: any;
  clientSideSessionData?: any;
}) {
  const getSessionData = () => {
    if (clientSideSessionData) {
      return clientSideSessionData;
    } else if (context) {
      return getServerSession(context.req, context.res, authOptions);
    } else {
      return null;
    }
  };

  const session = getSessionData();

  var requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Latitude: String(session?.token?.selected_address?.latitude || 25.192622),
      Longitude: String(
        session?.token?.selected_address?.longitude || 55.276383
      ),
    },
  };
  const url = `https://${
    process.env.NEXT_PUBLIC_API_ENDPOINT
  }/api/web/brands/details/${brandName}?${
    catSlug != "" ? `category_slug=${catSlug}&` : ""
  }${
    filterPath ? `${filterPath}&` : "orderBy=popularity&"
  }type=cols&skip=${noOfProducts}&take=40&new_method=true&lang=${lang}`;

  const res = await fetch(url, requestOptions);

  if (!res.ok) throw new Error("failed to fetch data");

  return res.json();
}
