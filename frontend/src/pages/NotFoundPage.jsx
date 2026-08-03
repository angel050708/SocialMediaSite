import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import { Blob } from "../components/ui/Blob.jsx";
import { Button } from "../components/ui/Button.jsx";

export function NotFoundPage() {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-4 text-center">
      <Blob shapeIndex={2} color="primary" size={420} className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
      <span className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Compass size={30} />
      </span>
      <h1 className="relative font-heading text-4xl font-semibold text-foreground">Off the path</h1>
      <p className="relative mt-2 max-w-sm text-muted-foreground">
        There's nothing growing here. Let's get you back.
      </p>
      <Link to="/" className="relative mt-6">
        <Button>Back to Grove</Button>
      </Link>
    </div>
  );
}
