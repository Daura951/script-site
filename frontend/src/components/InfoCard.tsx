import type { ReactNode } from "react";

type InfoCardProps = {
  title: string;
  body: string;
  iconColor?: string;
  icon?: ReactNode;
};

export default function InfoCard({
  title,
  body,
  iconColor,
  icon,
}: InfoCardProps) {
  return (
    <div className="md:w-50 p-2 md:h-60 text-center flex flex-col items-center border rounded-lg border-slate-400/20 shadow-lg md:border-none md:shadow-none">
      <header>
        <div
          className={`w-10 h-10 ${iconColor} rounded-3xl flex items-center justify-center`}
        >
          {icon}
        </div>
      </header>
      <h1 className="font-bold">{title}</h1>
      <p className="text-wrap mt-2">{body}</p>
    </div>
  );
}
