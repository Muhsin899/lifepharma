export default async function getAutoCompleteGoogleMapsData(query: string) {
  const res = await fetch(
    `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&key=AIzaSyC8F9csLoa6MRF3Cbg53T8Y4_YThxEp9rM`
  );

  if (!res.ok) throw new Error("Failed to fetch Data");

  return res.json();
}
