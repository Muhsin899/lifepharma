import Image from "next/image";
import { useState } from "react";
import { useCartActions } from "@/hooks/useCartActions";
import { Icon } from "./ui/icons";
import { Button, buttonVariants } from "./ui/button";
import { Typography, typographyVariants } from "./ui/typography";
import { cn } from "@/lib/utils";
import Link from "next/link";
export function CommandDemo({
  cartItems,
  subTotal,
}: {
  cartItems: any;
  subTotal: any;
}) {
  return (
    <div>
      {/* <div className="overflow-y-auto h-[17rem]">
        {cartItems.map((cartItem: any) => (
          <CartItem cartItem={cartItem} />
        ))}
      </div>
      <div className="py-3">
        <div
          className={cn(
            typographyVariants({ size: "sm" }),
            "flex justify-between text-black items-center"
          )}
        >
          <div className="">
            TOTAL{"  "} <span>(WITHOUT SHIPPING)</span>{" "}
          </div>
          AED {subTotal}
        </div>
      </div>
      <div className="flex justify-between text-white space-x-3 rtl:space-x-reverse">
        <Link
          href="/cart"
          className={
            " w-full " + buttonVariants({ variant: "default", rounded: "none" })
          }
        >
          CART
        </Link>
        <Link
          href="/checkout"
          className={
            " w-full " + buttonVariants({ variant: "outline", rounded: "none" })
          }
        >
          CHECK OUT
        </Link>
      </div> */}
      {/*
  This component uses @tailwindcss/forms

  yarn add @tailwindcss/forms
  npm install @tailwindcss/forms

  plugins: [require('@tailwindcss/forms')]

  @layer components {
    .no-spinner {
      -moz-appearance: textfield;
    }

    .no-spinner::-webkit-outer-spin-button,
    .no-spinner::-webkit-inner-spin-button {
      margin: 0;
      -webkit-appearance: none;
    }
  }
*/}

      <div
        className="relative w-screen max-w-sm border  bg-white px-4 py-8 sm:px-6 lg:px-8"
        aria-modal="true"
        role="dialog"
        tabIndex={-1}
      >
        <button className="absolute end-4 top-4 text-gray-600 transition hover:scale-110">
          <span className="sr-only">Close cart</span>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="mt-4 space-y-6">
          <ul className="space-y-4">
            {cartItems.map((cartItem: any) => (
              <CartItem cartItem={cartItem} />
            ))}
          </ul>

          <div className="space-y-3 text-center">
            <Link
              href={"/checkout"}
              className={cn(
                buttonVariants({ variant: "outline", size: "default" }),
                "!w-full py-3"
              )}
            >
              View my cart ({cartItems.length})
            </Link>
            <Link
              href={"/checkout"}
              className={cn(
                buttonVariants({ variant: "default", size: "default" }),
                "!w-full py-3"
              )}
            >
              Checkout
            </Link>

            <button className="inline-block text-sm text-primary underline underline-offset-4 transition hover:text-gray-600">
              Continue shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const CartItem = ({ cartItem }: { cartItem: any }) => {
  const { updateCart } = useCartActions();

  const [timeOutRemoveFromCart, setimeOutRemoveFromCart] = useState<any>(null);
  const [cartLoadingState, setCartLoadingState] = useState<any>(null);

  const cartInit: any = {
    action: "",
    data: {
      items: [
        // {
        //     id: "a6c1a3e7-caea-4845-94ca-a49de40f18c0",
        //     qty: 1
        // }
      ],
      address_id: null,
    },
  };

  const clearCartState = () => {
    cartInit.data.items = [];
    cartInit.action = "";
  };

  const updateCartItem = (qty: number) => {
    cartInit.data.items.push({ id: cartItem.id, qty: qty });
    // setCartLoadingState(true);
    // removedFromCart();
    // clearTimeout(timeOutRemoveFromCart);
    const timeout = setTimeout(() => {
      updateCart(cartInit);
      clearCartState();
      // setTimeout(() => {
      //   setCartLoadingState(false);
      // }, 2700);
    }, 500);
    setimeOutRemoveFromCart(timeout);
  };

  return (
    <li className="flex items-center gap-4">
      <Link className="flex items-center" href={`/product/${cartItem.slug}`}>
        <Image
          src={
            cartItem.featured_image
              ? cartItem.featured_image
              : "/images/default-product-image.png"
          }
          height={50}
          width={50}
          alt={cartItem.title}
          className="h-16 w-16 rounded object-cover"
        />
        {/* <Typography className=" text-gray-900" size={"sm"}>
        Basic Tee 6-Pack
      </Typography> */}
        <Typography lineClamp={"two"} size={"sm"} className="text-black">
          {cartItem.title}
        </Typography>
      </Link>

      <div className="flex flex-1 items-center justify-end gap-2">
        <form>
          <input
            type="number"
            min="1"
            defaultValue={cartItem.qty}
            onBlur={(e) => {
              Number(e.target.value) !== cartItem.qty &&
                Number(e.target.value) !== 0 &&
                updateCartItem(Number(e.target.value));
            }}
            id="Line1Qty"
            className="h-8 w-12 rounded border-gray-200 bg-gray-50 p-0 text-center text-xs text-gray-600 [-moz-appearance:_textfield] focus:outline-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
          />
        </form>

        <button className="text-gray-600 transition hover:text-red-600">
          <span className="sr-only">Remove item</span>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-4 w-4"
            onClick={() => {
              updateCartItem(0);
            }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
            />
          </svg>
        </button>
      </div>
    </li>
  );
};

export default CartItem;
