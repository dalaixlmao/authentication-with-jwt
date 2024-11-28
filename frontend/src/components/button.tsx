export default function Button({
  title,
  onClick,
}: {
  title: string;
  onClick: () => void;
}) {
  return (
    <div className="w-full">
      <button className="bg-black text-white w-1/2 rounded-md hover:bg-black/70 transition-all py-1" onClick={onClick}>{title}</button>
    </div>
  );
}
