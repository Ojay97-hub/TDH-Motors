import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, ExternalLink, Package, ShoppingBag } from "lucide-react";
import { sanityClient } from "@/sanity/client";
import { merchProductsQuery } from "@/sanity/queries";

export const metadata: Metadata = {
  title: "Merch | TDH Motors",
  description: "Shop The Dog House Motors official merchandise through TikTok Shop.",
};

export const revalidate = 60;

type MerchProduct = {
  _id: string;
  title: string;
  description?: string | null;
  priceLabel?: string | null;
  tiktokShopUrl?: string | null;
  status: "available" | "coming-soon" | "hidden";
  image?: string | null;
};

const TIKTOK_PROFILE_URL = "https://www.tiktok.com/@thedoghouseas";

function ProductImage({ product }: { product: MerchProduct }) {
  if (product.image) {
    return (
      <Image
        src={product.image}
        alt={product.title}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover group-hover:scale-105 transition-transform duration-700"
      />
    );
  }

  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-linear-to-br from-stone-700 to-stone-900">
      <ShoppingBag size={40} className="text-stone-300 mb-3" strokeWidth={1.5} />
      <div className="text-xs tracking-[0.3em] uppercase text-stone-300">Merch</div>
    </div>
  );
}

export default async function MerchPage() {
  const products = await sanityClient.fetch<MerchProduct[]>(
    merchProductsQuery,
    {},
    { next: { revalidate: 60, tags: ["merchProduct"] } },
  );

  const hasProducts = products.length > 0;

  return (
    <>
      <section className="container-page pt-32 md:pt-40 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 lg:gap-20 items-end">
          <div className="max-w-3xl">
            <div className="text-xs tracking-[0.3em] uppercase text-brand-light mb-3">Merch</div>
            <h1 className="font-display text-5xl md:text-6xl tracking-tight mb-6">
              The Dog House Shop
            </h1>
            <p className="text-text-muted text-lg leading-relaxed">
              Official TDH apparel and accessories, managed in Sanity and checked out securely through TikTok Shop.
            </p>
          </div>

          <div className="border border-border bg-bg-elevated p-8">
            <Package size={30} className="text-brand-light mb-5" strokeWidth={1.5} />
            <h2 className="font-display text-2xl tracking-wide mb-3">TikTok handles checkout</h2>
            <p className="text-text-muted leading-relaxed">
              Add each product in Sanity with its TikTok Shop URL. Customers browse here, then buy through TikTok.
            </p>
          </div>
        </div>
      </section>

      <section className="container-page pb-24">
        {hasProducts ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => {
              const isComingSoon = product.status === "coming-soon";
              const canBuy = !isComingSoon && Boolean(product.tiktokShopUrl);

              return (
                <article
                  key={product._id}
                  className="group bg-bg-elevated border border-border hover:border-brand transition-all overflow-hidden"
                >
                  <div className="relative aspect-4/3 overflow-hidden bg-stone-800">
                    <ProductImage product={product} />
                    {isComingSoon && (
                      <div className="absolute top-4 left-4 bg-amber-500 text-stone-900 px-3 py-1 text-xs uppercase tracking-widest font-medium">
                        Coming Soon
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="text-xs text-text-subtle tracking-widest uppercase mb-2">
                      Official TDH Merch
                    </div>
                    <h2 className="font-display text-xl tracking-wide mb-3">{product.title}</h2>
                    {product.description && (
                      <p className="text-text-muted text-sm leading-relaxed mb-5">
                        {product.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between gap-4 pt-5 border-t border-border">
                      <div>
                        <div className="text-xs text-text-subtle uppercase tracking-wider">Price</div>
                        <div className="font-display text-lg text-text">
                          {product.priceLabel || "See TikTok"}
                        </div>
                      </div>
                      {canBuy ? (
                        <a
                          href={product.tiktokShopUrl ?? "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 bg-brand hover:bg-brand-light text-on-brand px-4 py-3 font-medium tracking-wider uppercase text-xs transition-colors"
                        >
                          Buy <ExternalLink size={13} />
                        </a>
                      ) : (
                        <span className="inline-flex items-center justify-center gap-2 bg-border text-text-muted px-4 py-3 font-medium tracking-wider uppercase text-xs">
                          Soon
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="border border-border bg-bg-elevated p-10 md:p-14 text-center">
            <ShoppingBag size={42} className="text-brand-light mx-auto mb-5" strokeWidth={1.5} />
            <h2 className="font-display text-3xl md:text-4xl tracking-tight mb-4">
              Merch drops are coming soon
            </h2>
            <p className="text-text-muted max-w-xl mx-auto leading-relaxed mb-8">
              Once products are added in Sanity, they will appear here with direct links to complete the purchase on TikTok Shop.
            </p>
            <a
              href={TIKTOK_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-brand hover:bg-brand-light text-on-brand px-8 py-4 font-medium tracking-wider uppercase text-sm transition-colors"
            >
              Follow on TikTok <ArrowRight size={16} />
            </a>
          </div>
        )}
      </section>

      <section className="border-t border-border bg-bg-elevated">
        <div className="container-page py-24 text-center">
          <h2 className="font-display text-3xl md:text-4xl tracking-tight mb-6">Stay Updated</h2>
          <p className="text-text-muted max-w-xl mx-auto mb-10 leading-relaxed">
            Follow TDH on TikTok for new drops, restocks, and behind-the-scenes previews.
          </p>
          <a
            href={TIKTOK_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-brand hover:bg-brand-light text-on-brand px-8 py-4 font-medium tracking-wider uppercase text-sm transition-colors"
          >
            Follow on TikTok <ArrowRight size={16} />
          </a>
        </div>
      </section>
    </>
  );
}
