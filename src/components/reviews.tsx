import { Typography } from "./ui/typography";
import { Pagination, Navigation, Autoplay, Swiper as SwiperType } from "swiper";
import { useRef } from "react";
import { Icon } from "./ui/icons";
import { Swiper, SwiperSlide } from "swiper/react";

const ReviewsComp = ({ reviewsData }: { reviewsData: any }) => {
  const swiperRef = useRef<SwiperType>();
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

  return (
    <div className="lg:w-7/12 w-full py-3  px-2 ">
      <div className="flex justify-between items-center mb-2">
        <Typography bold={"semibold"} size={"xl"}>
          Reviews{" "}
        </Typography>
        <div className="flex space-x-2 rtl:space-x-reverse h-fit items-center">
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="bg-blue-500 p-1.5 rounded-full"
          >
            <Icon type="chevronLeftIcon" className="text-white " />
          </button>
          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="bg-blue-500 p-1.5 rounded-full"
          >
            <Icon type="chevronRightIcon" className="text-white  " />
          </button>
        </div>
      </div>
      <Swiper
        slidesPerView={1}
        spaceBetween={5}
        onBeforeInit={(swiper) => {
          swiperRef.current = swiper;
        }}
        modules={[Navigation]}
      >
        {reviewsData.map((reviewData: any) => (
          <SwiperSlide>
            <div className="flex justify-start py-4  bg-slate-100  rounded-lg px-4 w-full">
              <div className="w-full">
                <div className="flex justify-between">
                  <Typography bold={"semibold"} className="">
                    {reviewData.user_details.name}
                  </Typography>
                  <div className="text-gray-400 sm:text-sm text-xs ">
                    {formatDate(reviewData.created_at)}
                  </div>
                </div>
                <div className=" w-1/2 flex justify-start space-x-0.5 py-2 rtl:space-x-reverse">
                  {Array(5).fill(
                    <Icon
                      type="starIcon"
                      className="fill-amber-500 text-amber-500"
                      sizes={"sm"}
                    />
                  )}
                </div>
                <div className=" my-2 ">
                  {reviewData.review ? (
                    reviewData.review
                  ) : (
                    <Typography
                      variant={"paragraph"}
                      size={"sm"}
                      className="italic"
                    >
                      No Comment
                    </Typography>
                  )}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ReviewsComp;
