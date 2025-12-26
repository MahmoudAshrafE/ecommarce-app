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
import { useTranslations } from "next-intl";
import { Check, Minus, Plus, ShoppingCart, Trash2, Sparkles, Star } from "lucide-react";

const AddToCartButton = ({ item }: { item: ProductWithRelations }) => {
  const t = useTranslations()
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
          className="mt-4 w-full rounded-2xl font-bold text-sm h-12 transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 bg-gradient-to-r from-primary to-primary/90 uppercase tracking-wide"
        >
          <ShoppingCart className="mr-2 w-4 h-4" />
          <span>{t('menuItem.addToCart')}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] sm:max-w-[550px] max-h-[92vh] md:max-h-[95vh] p-0 gap-0 bg-gradient-to-br from-background via-background to-black/5 dark:to-black/20 text-foreground backdrop-blur-2xl border-2 border-border/50 shadow-2xl rounded-[2rem] md:rounded-[2.5rem] animate-in fade-in zoom-in duration-300 flex flex-col [&>button]:text-foreground hover:[&>button]:text-primary overflow-hidden">
        {/* Header Image Section with Enhanced Gradients */}
        <div className="relative w-full h-44 md:h-56 bg-gradient-to-br from-primary/20 via-primary/10 to-orange-500/10 flex items-center justify-center p-6 md:p-8 overflow-hidden flex-shrink-0">
          {/* Animated Background Elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-500/20 rounded-full blur-2xl animate-pulse delay-75" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />

          {/* Premium Badge */}


          <Image
            alt={item.name}
            src={item.image}
            width={180}
            height={180}
            className="object-contain drop-shadow-2xl z-10 transition-all hover:scale-110 hover:rotate-3 duration-700 animate-in zoom-in duration-500 w-32 md:w-44"
          />
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-5 md:p-8 space-y-6 md:space-y-8 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-foreground/20 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-foreground/40">
          <DialogHeader className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <DialogTitle className="text-2xl md:text-3xl font-black tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent animate-in slide-in-from-left duration-500">{item.name}</DialogTitle>
              <div className="flex flex-col items-end gap-1 animate-in slide-in-from-right duration-500">
                <span className="bg-gradient-to-r from-primary to-orange-500 text-black px-3 md:px-4 py-1.5 md:py-2 rounded-xl md:rounded-2xl text-lg md:text-xl font-black shadow-lg shadow-primary/25 whitespace-nowrap">{formatCurrency(totalPrice)}</span>
                {selectedExtras.length > 0 && (
                  <span className="text-xs text-muted-foreground font-medium">+{selectedExtras.length} extras</span>
                )}
              </div>
            </div>
            <DialogDescription className="text-muted-foreground leading-relaxed text-base animate-in fade-in duration-700">
              {item.description}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-8">
            {/* Sizes Section */}
            <div className="space-y-4 animate-in slide-in-from-bottom duration-500 delay-100">
              <div className="flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-primary to-orange-500 rounded-full" />
                <Label className="text-lg font-black uppercase tracking-widest text-foreground">{t('sizes')}</Label>
              </div>
              <div className="grid grid-cols-2 xs:grid-cols-3 gap-3">
                <PickSize
                  sizes={item.sizes}
                  item={item}
                  selectedSize={selectedSize}
                  setSelectedSize={setSelectedSize}
                  t={t}
                />
              </div>
            </div>

            {/* Extras Section */}
            {item.extras.length > 0 && (
              <div className="space-y-4 animate-in slide-in-from-bottom duration-500 delay-200">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-6 bg-gradient-to-b from-orange-500 to-primary rounded-full" />
                  <Label className="text-lg font-black uppercase tracking-widest text-foreground flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    {t('extrasIngredients')}
                  </Label>
                </div>
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
        </div>

        {/* Enhanced Footer with Glassmorphism */}
        <DialogFooter className="p-4 md:p-6 bg-gradient-to-t from-secondary/60 via-secondary/30 to-transparent border-t-2 border-border/50 backdrop-blur-xl flex-shrink-0 shadow-2xl animate-in slide-in-from-bottom duration-500 delay-300">
          {quantity === 0 ? (
            <Button
              type='submit'
              onClick={handleAddToCart}
              className='w-full h-14 md:h-16 text-base font-bold rounded-xl md:rounded-2xl shadow-2xl shadow-primary/30 hover:shadow-primary/40 hover:scale-[1.02] active:scale-95 transition-all bg-gradient-to-r from-primary via-primary to-orange-500 uppercase tracking-wide'
            >
              <ShoppingCart className="mr-3 w-5 h-5 md:w-6 md:h-6" />
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
      <div className="flex items-center gap-4 bg-gradient-to-r from-background via-secondary/30 to-background border-2 border-border/50 rounded-2xl p-2 shadow-lg flex-1 justify-between backdrop-blur-sm">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 md:h-12 md:w-12 rounded-lg md:rounded-xl hover:bg-destructive/20 hover:text-destructive transition-all hover:scale-110 active:scale-95 shadow-md text-foreground"
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
          <span className="font-black text-2xl min-w-[3ch] text-center bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">{quantity}</span>
          <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">{t('cart.inCart')}</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 md:h-12 md:w-12 rounded-lg md:rounded-xl hover:bg-primary/20 hover:text-primary transition-all hover:scale-110 active:scale-95 shadow-md text-foreground"
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
        className="h-14 w-14 md:h-16 md:w-16 rounded-xl md:rounded-2xl shadow-xl shadow-destructive/30 hover:shadow-destructive/40 hover:scale-110 active:scale-95 transition-all"
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
                ? "border-transparent bg-gradient-to-br from-primary via-primary to-orange-500 text-black"
                : "border-border/50 bg-gradient-to-br from-card to-secondary/20 hover:border-primary/40 hover:shadow-lg"
              }
            `}
          >
            {isSelected && (
              <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-r from-orange-500 to-primary text-white flex items-center justify-center shadow-lg animate-in zoom-in duration-300">
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
  t: any;
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
                ? "border-transparent bg-gradient-to-br from-primary/20 via-primary/10 to-orange-500/10 border-primary/30"
                : "border-border/50 bg-gradient-to-br from-card to-secondary/10 hover:border-primary/30 hover:shadow-md"
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
                ? 'bg-gradient-to-r from-primary to-orange-500 border-transparent shadow-lg shadow-primary/30 scale-110'
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
