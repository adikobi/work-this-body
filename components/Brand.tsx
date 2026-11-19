/** The wordmark. Identical in every language: same name, same typeface, same tracking (see .brand in globals.css). */
export default function Brand() {
  return (
    <span lang="en" className="brand font-extrabold tracking-tight text-zinc-50">
      work<span className="text-work">-this-</span>body
    </span>
  );
}
