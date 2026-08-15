interface DashboardWelcomeProps {
  name: string;
}

export default function DashboardWelcome({
  name,
}: DashboardWelcomeProps) {
  return (
    <div className="flex flex-col justify-end pb-4 lg:col-span-2">
      <h1 className="text-4xl font-bold tracking-tight text-[#e6e0e8] md:text-5xl">
        Welcome back,{" "}
        <span className="voyage-gradient-text">
          {name}
        </span>
      </h1>

      <p className="mt-3 text-lg text-[#cbc4d2]">
        The world is waiting. Where to next?
      </p>
    </div>
  );
}