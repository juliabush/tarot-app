export default function TarotResponse({ text }: { text: string }) {
  return (
    <div className="mt-10 bg-black/40 p-6 max-w-2xl rounded-xl backdrop-blur-md shadow-lg">
      <p className="text-3xl leading-relaxed">{text}</p>
    </div>
  );
}
