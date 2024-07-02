import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md text-center">
        {/* <img */}
        {/*   src="/placeholder.svg" */}
        {/*   width={300} */}
        {/*   height={300} */}
        {/*   alt="Lost Astronaut" */}
        {/*   className="mx-auto" */}
        {/* /> */}
        <h1 className="mt-8 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Oops! You seem to have lost your way
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {`It looks like you've stumbled upon a 404 error. Don't worry, your intergalactic GPS must have malfunctioned.
          Let's get you back on track!`}
        </p>
        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            prefetch={false}
          >
            Take me home
          </Link>
        </div>
      </div>
    </div>
  );
}
