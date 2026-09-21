export default function AboutPage() {
  return (
    <>
      <div className="pb-10 pt-4 flex flex-col text-white items-center justify-center bg-[#0f172a] bg-[radial-gradient(circle_600px_at_50%_50%,rgba(59,130,246,0.3),transparent)]">
        <div className="flex flex-col items-center gap-10 mt-16">
          <header>
            <h1 className="text-xl md:text-6xl font-bold">About</h1>
          </header>
          <p className="max-w-100 md:max-w-250 text-center">
            (Some intro text) Lorem ipsum dolor sit amet consectetur adipisicing
            elit. Quas dignissimos, asperiores explicabo eligendi repudiandae
            magni quidem debitis odio aliquam necessitatibus aperiam ratione
            voluptates qui assumenda pariatur enim quaerat? Cum, magni.
          </p>
        </div>
      </div>
      <div className="mt-4">
        <h2 className="text-lg md:text-4xl font-bold text-center">Info</h2>
        <p className=" p-2">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iusto facere
          consectetur magnam, dolore incidunt repellat. Placeat quos facilis
          explicabo dolor fuga atque accusantium laboriosam nesciunt,
          perferendis ducimus tempora dicta! Quidem.
          <br />
          <br />
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora
          incidunt fugiat deleniti maiores sed. Error cupiditate, tempora maxime
          labore ipsam nihil unde fugit, distinctio ex qui eveniet expedita,
          harum velit. Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Suscipit, officiis? Earum veritatis esse alias rerum excepturi
          deleniti corrupti quaerat neque nulla illo officia, nisi sit
          perspiciatis. Molestiae dicta modi corrupti. Lorem ipsum dolor sit
          amet consectetur adipisicing elit. Illum harum recusandae dolorem ea
          sint omnis deleniti adipisci aperiam fugiat iure ratione earum
          nesciunt, temporibus perferendis consequatur deserunt numquam modi
          non.
        </p>
      </div>
    </>
  );
}
