import { NextApiResponse } from "next";
import { NextRequest } from "next/server";

export default async (req: NextRequest, res: NextApiResponse) => {
  //@ts-ignore
  const { input } = req.query;

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input || ""}&language=en&key=AIzaSyC8F9csLoa6MRF3Cbg53T8Y4_YThxEp9rM`
    );
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }

  // if (!res.ok) throw new Error("Failed to fetch Data");

  // return res.json();
};
