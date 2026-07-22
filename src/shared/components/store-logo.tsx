import { cn } from "@/shared/utils/cn";

export function StoreLogo({
  logoUrl,
  storeName,
  className,
}: {
  logoUrl?: string;
  storeName: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl",
        logoUrl
          ? "bg-white ring-1 ring-inset ring-gray-200"
          : "bg-gradient-to-br from-brand-500 to-brand-700 text-base font-black text-white shadow-[0_6px_16px_-6px_rgba(46,125,50,0.7)]",
        className,
      )}
    >
      {logoUrl ? (
        // The URL is admin-managed and may point to the local upload API or an external CDN.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logoUrl}
          alt={`${storeName} logosu`}
          className="h-full w-full object-contain p-1"
        />
      ) : (
        <>
          BT
          <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-leaf-400 ring-2 ring-white" />
        </>
      )}
    </span>
  );
}
