import { Leaf } from "lucide-react";
import { Blob } from "./ui/Blob.jsx";
import { Card } from "./ui/Card.jsx";

export function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden px-4 py-16">
      <Blob shapeIndex={0} color="primary" size={480} className="-left-40 -top-32" />
      <Blob shapeIndex={1} color="secondary" size={420} className="-right-32 bottom-0" />

      <Card className="relative w-full max-w-md p-8 sm:p-10" radiusVariant={1}>
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-soft">
            <Leaf size={26} />
          </span>
          <h1 className="font-heading text-3xl font-semibold text-foreground">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {children}
        {footer && <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>}
      </Card>
    </div>
  );
}
