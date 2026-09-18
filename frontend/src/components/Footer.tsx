import guild_logo_white from "../assets/Guild_logo_white.png";

export default function Footer() {
  return (
    <footer className=" bg-blue-950 px-6 py-8 font-light text-white border-t border-white/15">
      <div className="mx-auto flex max-w-7xl flex-col-reverse items-center justify-center gap-8 md:flex-row-reverse md:gap-16">
        <img
          src={guild_logo_white}
          alt="The GOV  Seal"
          title="GOV Seal"
          className="h-25 w-auto"
        />
      </div>
    </footer>
  );
}
