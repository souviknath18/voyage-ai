interface LoaderProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  fullScreen?: boolean;
}

export default function Loader({
  size = "md",
  text,
  fullScreen = false,
}: LoaderProps) {
  const sizes = {
    sm: "h-4 w-4 border-2",
    md: "h-7 w-7 border-[3px]",
    lg: "h-10 w-10 border-4",
  };

  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`
          animate-spin
          rounded-full
          border-[#d1bcff]/20
          border-t-[#fb7185]

          ${sizes[size]}
        `}
      />

      {text && (
        <p className="text-sm text-[#cbc4d2]">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
}