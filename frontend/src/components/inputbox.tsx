export default function InputBox({
  label,
  placeholder,
  type,
  onChange,
}: {
  label: string;
  placeholder: string;
  type: string;
  onChange: (e: any) => void;
}) {
  return (
    <div className="w-full my-2 flex flex-col items-center">
      <label className="w-1/2 my-1 text-left font-semibold">{label}</label>
      <input
        className="w-1/2 my-1 border py-1 px-2 rounded-lg"
        placeholder={placeholder}
        type={type}
        onChange={onChange}
      />
    </div>
  );
}
