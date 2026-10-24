import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-x flex min-h-[80svh] flex-col items-start justify-center pt-24">
      <p className="eyebrow">404</p>
      <h1 className="h-display mt-4 text-5xl md:text-6xl">Lost in the fog.</h1>
      <p className="mt-4 text-lg text-mist">That page isn&apos;t here. Let&apos;s get you back to base camp.</p>
      <Link href="/" className="btn btn-primary mt-8">
        Go home
      </Link>
    </div>
  );
}
