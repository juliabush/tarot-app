export default function TarotCard({
  image,
  name,
}: {
  image: string;
  name: string;
}) {
  return (
    <div className="flex flex-col items-center">
      <img
        src={image}
        className="h-[250px] w-auto rounded-xl shadow-2xl border border-gray-300"
        alt={name}
      />
      <p className="mt-4 text-xl tracking-wider">{name}</p>
    </div>
  );
}
