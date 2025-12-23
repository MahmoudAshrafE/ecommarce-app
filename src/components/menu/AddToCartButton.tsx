"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@radix-ui/react-label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { formatCurrency } from "@/lib/formaters";
import { ProductSizes, ProductWithRelations } from "@/types/product";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  addCartItem,
  removeCartItem,
  removeItemFromCart,
  selectCartItems,
} from "@/redux/features/cart/cartSlice";
import { Extra, Size } from "@/generated/prisma/client";
import { getItemQuantity } from "@/lib/cart";
import { useTranslations } from "next-intl";

const AddToCartButton = ({ item }: { item: ProductWithRelations }) => {
  const t = useTranslations()
  {
    /*for Cart state*/
  }
  const cart = useAppSelector(selectCartItems);
  const dispatch = useAppDispatch();




  const defaultSize =
    cart.find((e) => e.id === item.id)?.size ||
    item.sizes.find((s) => s.name === ProductSizes.SMALL);

  const [selectedSize, setSelectedSize] = useState<Size>(defaultSize!);
  const defaultExtras = cart.find((e) => e.id === item.id)?.extras || [];
  const [selectedExtras, setSelectedExtras] = useState<Extra[]>(defaultExtras);


  const quantity =
    selectedSize
      ? getItemQuantity(
        item.id,
        selectedSize.id,
        selectedExtras.map(e => e.id),
        cart
      )
      : 0;

  {
    /*Calculate the total price */
  }
  let totalPrice = item.basePrice;
  if (selectedSize) {
    totalPrice += selectedSize.price;
  }
  if (selectedExtras.length > 0) {
    for (const extra of selectedExtras) {
      totalPrice += extra.price;
    }
  }

  const handleAddToCart = () => {
    dispatch(
      addCartItem({
        basePrice: item.basePrice,
        name: item.name,
        id: item.id,
        image: item.image,
        size: selectedSize,
        extras: selectedExtras,
      })
    );
  };

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button
            type="button"
            size="lg"
            className="mt-4 text-white rounded-full cursor-pointer px-8!"
          >
            <span>{t('menuItem.addToCart')}</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto">
          <DialogHeader className="flex items-center">
            <Image alt={item.name} src={item.image} width={200} height={200} />
            <DialogTitle className="text-center">{item.name}</DialogTitle>
            <DialogDescription className="text-center">
              {item.description}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-10">
            <div className="space-y-4 text-center">
              <Label htmlFor="pick-size">{t('sizes')}</Label>
              <PickSize
                sizes={item.sizes}
                item={item}
                selectedSize={selectedSize}
                setSelectedSize={setSelectedSize}
                t={t}
              />
            </div>
            <div className="space-y-4 text-center">
              <Label htmlFor="pick-size">{t('extrasIngredients')}</Label>
              <Extras
                extras={item.extras}
                selectedExtras={selectedExtras}
                setSelectedExtras={setSelectedExtras}
                t={t}
              />
            </div>
          </div>
          <DialogFooter>
            {quantity === 0 ? (
              <Button
                type='submit'
                onClick={handleAddToCart}
                className='w-full h-10'
              >
                {t('menuItem.addToCart')} {formatCurrency(totalPrice)}
              </Button>
            ) : (
              <ChooseQuantity
                quantity={quantity}
                item={item}
                selectedSize={selectedSize}
                selectedExtras={selectedExtras}
              />
            )}
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};
export default AddToCartButton;

// choose quantity button
const ChooseQuantity = ({
  quantity,
  item,
  selectedExtras,
  selectedSize,
}: {
  quantity: number;
  selectedExtras: Extra[];
  selectedSize: Size;
  item: ProductWithRelations;
}) => {
  const dispatch = useAppDispatch();
  const t = useTranslations()
  return (
    <div className="flex items-center flex-col gap-2 mt-4 w-full">
      <div className="flex items-center justify-center gap-2">
        <Button
          variant="outline"
          onClick={() => dispatch(removeCartItem({
            basePrice: item.basePrice,
            name: item.name,
            id: item.id,
            image: item.image,
            size: selectedSize,
            extras: selectedExtras,
          }))}
        >
          -
        </Button>
        <div>
          <span className="text-black">{quantity} {t('cart.inCart')}</span>
        </div>
        <Button
          variant="outline"
          onClick={() =>
            dispatch(
              addCartItem({
                basePrice: item.basePrice,
                id: item.id,
                image: item.image,
                name: item.name,
                extras: selectedExtras,
                size: selectedSize,
              })
            )
          }
        >
          +
        </Button>
      </div>
      <Button
        size="sm"
        onClick={() => dispatch(removeItemFromCart({
          basePrice: item.basePrice,
          name: item.name,
          id: item.id,
          image: item.image,
          size: selectedSize,
          extras: selectedExtras,
        }))}
      >
        {t('delete')}
      </Button>
    </div>
  );
};

// pick size radio group
export function PickSize({
  sizes,
  item,
  selectedSize,
  setSelectedSize,
  t,
}: {
  sizes: Size[];
  item: ProductWithRelations;
  selectedSize: Size;
  setSelectedSize: React.Dispatch<React.SetStateAction<Size>>;
  t: any;
}) {
  return (
    <RadioGroup defaultValue="comfortable">
      {sizes.map((size) => (
        <div
          key={size.id}
          className="flex items-center gap-3 border border-gray-100 rounded-md p-4"
        >
          <RadioGroupItem
            value={selectedSize.name}
            checked={selectedSize.id === size.id}
            onClick={() => setSelectedSize(size)}
            id={size.id}
            className="border-primary"
          />
          <Label htmlFor={size.id} className="text-sm text-accent font-medium">
            {t(size.name)} {formatCurrency(item.basePrice + size.price)}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
}

// pick extras checkbox
export function Extras({
  extras,
  selectedExtras,
  setSelectedExtras,
  t,
}: {
  extras: Extra[];
  selectedExtras: Extra[];
  setSelectedExtras: React.Dispatch<React.SetStateAction<Extra[]>>;
  t: any;
}) {
  const handleExtra = (extra: Extra) => {
    if (selectedExtras.find((e) => e.id === extra.id)) {
      const filteredSelectedExtras = selectedExtras.filter(
        (item) => item.id !== extra.id
      );
      setSelectedExtras(filteredSelectedExtras);
    } else {
      setSelectedExtras((prev) => [...prev, extra]);
    }
  };
  return extras.map((extra) => (
    <div
      key={extra.id}
      className="flex items-center space-x-2 border border-gray-100 rounded-md p-4"
    >
      <Checkbox
        onClick={() => handleExtra(extra)}
        checked={Boolean(selectedExtras.find((e) => e.id === extra.id))}
        id={extra.id}
        className="border-primary"
      />
      <Label
        htmlFor={extra.id}
        className="text-sm text-accent font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {t(extra.name)} {formatCurrency(extra.price)}
      </Label>
    </div>
  ));
}
