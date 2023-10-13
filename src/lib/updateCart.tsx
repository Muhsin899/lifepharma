export default async function updateCartApiReq(payLoadData: any, cartId: number, sessionData:any) {

    var raw = JSON.stringify(payLoadData);


    var requestOptions: RequestInit = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            Latitude: String(sessionData?.token?.selected_address?.latitude || 25.192622),
            Longitude: String(sessionData?.token?.selected_address?.longitude || 55.276383),
          },
        body: raw,
        redirect: 'follow'
    };


    const res = await fetch(`https://${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/carts/v2/${cartId}/update`, requestOptions)

    if (!res.ok) throw new Error('failed to fetch data')

    return res.json()

}