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
import { Label } from "@/components/ui/label";
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
import { useLocale, useTranslations } from "next-intl";
import { Check, Minus, Plus, ShoppingCart, Trash2, Sparkles } from "lucide-react";


const AddToCartButton = ({ item }: { item: ProductWithRelations }) => {
  const t = useTranslations()
  const locale = useLocale();
  const isRtl = locale === 'ar';
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
      <DialogTrigger asChild>
        <Button
          type="button"
          size="lg"
          className="mt-4 w-full rounded-2xl font-bold text-sm h-12 transition-all hover:scale-[1.02] active:scale-95 border border-primary/20 bg-linear-to-r from-primary to-primary/90 uppercase tracking-wide"
        >
          <ShoppingCart className="mr-2 w-4 h-4" />
          <span>{t('menuItem.addToCart')}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] sm:max-w-md max-h-[90vh] p-0 overflow-hidden bg-background rounded-2xl border border-border shadow-lg flex flex-col">
        <DialogHeader className="p-6 pb-4 border-b shrink-0 px-14 text-left rtl:text-right" dir={isRtl ? 'rtl' : 'ltr'}>
          <div className="flex items-center gap-4">
            {/* Small Product Image */}
            <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-secondary/30 shrink-0 border border-border">
              <Image
                alt={isRtl ? item.nameAr || item.name : item.name}
                src={item.image}
                fill
                className="object-contain p-1"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col">
                <DialogTitle className="text-lg font-bold truncate leading-tight">
                  {isRtl ? item.nameAr || item.name : item.name}
                </DialogTitle>
                <span className="text-xl font-black text-primary mt-0.5">{formatCurrency(totalPrice)}</span>
              </div>
              <DialogDescription className="text-[10px] text-muted-foreground line-clamp-2 mt-1 uppercase tracking-wider font-medium">
                {isRtl ? item.descriptionAr || item.description : item.description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Sizes Section */}
          {item.sizes.length > 0 && (
            <div className="space-y-4">
              <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">{t('sizes')}</Label>
              <div className="grid grid-cols-2 xs:grid-cols-3 gap-3">
                <PickSize
                  sizes={item.sizes}
                  selectedSize={selectedSize}
                  setSelectedSize={setSelectedSize}
                  t={t}
                />
              </div>
            </div>
          )}

          {/* Extras Section */}
          {item.extras.length > 0 && (
            <div className="space-y-4">
              <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">{t('extrasIngredients')}</Label>
              <div className="flex flex-col gap-3">
                <Extras
                  extras={item.extras}
                  selectedExtras={selectedExtras}
                  setSelectedExtras={setSelectedExtras}
                  t={t}
                />
              </div>
            </div>
          )}
        </div>

        {/* Simplified Footer */}
        <DialogFooter className="p-4 border-t bg-secondary/5 mb-0 shrink-0">
          {quantity === 0 ? (
            <Button
              type='submit'
              onClick={handleAddToCart}
              className='w-full h-12 text-sm font-bold rounded-xl transition-all hover:scale-[1.01] active:scale-95 bg-primary text-primary-foreground uppercase tracking-wide'
            >
              <ShoppingCart className="mr-2 w-4 h-4" />
              {t('menuItem.addToCart')}
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
    </Dialog>
  );
};

export default AddToCartButton;

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
    <div className="flex items-center justify-between w-full gap-4">
      <div className="flex items-center gap-4 bg-secondary/10 border border-white/5 rounded-2xl p-2 flex-1 justify-between backdrop-blur-sm">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 md:h-12 md:w-12 rounded-lg md:rounded-xl hover:bg-destructive/20 hover:text-destructive transition-all hover:scale-110 active:scale-95 text-foreground"
          onClick={() => dispatch(removeCartItem({
            basePrice: item.basePrice,
            name: item.name,
            id: item.id,
            image: item.image,
            size: selectedSize,
            extras: selectedExtras,
          }))}
        >
          <Minus className="w-5 h-5 stroke-[3px]" />
        </Button>
        <div className="flex flex-col items-center">
          <span className="font-black text-2xl min-w-[3ch] text-center bg-linear-to-r from-primary to-orange-500 bg-clip-text text-transparent">{quantity}</span>
          <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">{t('cart.inCart')}</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 md:h-12 md:w-12 rounded-lg md:rounded-xl hover:bg-primary/20 hover:text-primary transition-all hover:scale-110 active:scale-95 text-foreground"
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
          <Plus className="w-5 h-5 stroke-[3px]" />
        </Button>
      </div>

      <Button
        variant="destructive"
        className="h-14 w-14 md:h-16 md:w-16 rounded-xl md:rounded-2xl hover:scale-110 active:scale-95 transition-all border border-destructive/20"
        onClick={() => dispatch(removeItemFromCart({
          basePrice: item.basePrice,
          name: item.name,
          id: item.id,
          image: item.image,
          size: selectedSize,
          extras: selectedExtras,
        }))}
      >
        <Trash2 className="w-5 h-5 md:w-6 md:h-6" />
      </Button>
    </div>
  );
};

export function PickSize({
  sizes,
  selectedSize,
  setSelectedSize,
  t,
}: {
  sizes: Size[];
  selectedSize: Size;
  setSelectedSize: React.Dispatch<React.SetStateAction<Size>>;
  t: (key: string) => string;
}) {
  return (
    <>
      {sizes.map((size) => {
        const isSelected = selectedSize.id === size.id;
        return (
          <div
            key={size.id}
            onClick={() => setSelectedSize(size)}
            className={`
                cursor-pointer group relative flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all duration-300 hover:scale-105 active:scale-95
                ${isSelected
                ? "border-transparent bg-linear-to-br from-primary via-primary to-orange-500 text-black"
                : "border-border/50 bg-linear-to-br from-card to-secondary/20 hover:border-primary/40 hover:shadow-lg"
              }
            `}
          >
            {isSelected && (
              <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-linear-to-r from-orange-500 to-primary text-white flex items-center justify-center shadow-lg animate-in zoom-in duration-300">
                <Check className="w-3.5 h-3.5 stroke-[3px]" />
              </div>
            )}
            <span className={`font-black text-base tracking-wide uppercase ${isSelected ? 'text-primary-foreground' : 'text-foreground'}`}>{t(size.name)}</span>
            <span className={`text-xs font-bold ${isSelected ? 'text-primary-foreground/90' : 'text-muted-foreground'}`}>
              {size.price > 0 ? `+${formatCurrency(size.price)}` : 'Free'}
            </span>
          </div>
        )
      })}
    </>
  );
}

export function Extras({
  extras,
  selectedExtras,
  setSelectedExtras,
  t,
}: {
  extras: Extra[];
  selectedExtras: Extra[];
  setSelectedExtras: React.Dispatch<React.SetStateAction<Extra[]>>;
  t: (key: string) => string;
}) {
  const handleExtra = (extra: Extra) => {
    if (selectedExtras.find((e) => e.id === extra.id)) {
      setSelectedExtras(prev => prev.filter((item) => item.id !== extra.id));
    } else {
      setSelectedExtras((prev) => [...prev, extra]);
    }
  };

  return (
    <>
      {extras.map((extra) => {
        const isSelected = Boolean(selectedExtras.find((e) => e.id === extra.id));
        return (
          <div
            key={extra.id}
            onClick={() => handleExtra(extra)}
            className={`
                cursor-pointer group flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-300 hover:scale-105 active:scale-95
                ${isSelected
                ? "bg-linear-to-br from-primary/20 via-primary/10 to-orange-500/10 border-primary/30"
                : "border-border/50 bg-linear-to-br from-card to-secondary/10 hover:border-primary/30 hover:shadow-md"
              }
            `}
          >
            <div className="flex flex-col gap-1">
              <span className={`font-black text-sm transition-colors uppercase tracking-wide ${isSelected ? 'text-primary' : 'text-foreground'}`}>{t(extra.name)}</span>
              <span className={`text-xs font-bold ${isSelected ? 'text-primary/70' : 'text-muted-foreground'}`}>+{formatCurrency(extra.price)}</span>
            </div>
            <div className={`
                    w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                    ${isSelected
                ? 'bg-linear-to-r from-primary to-orange-500 border-transparent shadow-lg shadow-primary/30 scale-110'
                : 'border-border/50 group-hover:border-primary/40 group-hover:scale-105'
              }
                `}>
              {isSelected && <Check className="w-4 h-4 text-white stroke-[3px] animate-in zoom-in duration-200" />}
            </div>
          </div>
        )
      })}
    </>
  );
}
