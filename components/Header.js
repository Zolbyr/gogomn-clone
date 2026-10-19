import Link from "next/link";
import Nav from "./Nav";

export default function Header() {
  return (
    <>
      <div className="top"><div className="wrap"><span>USD 3,450₮ · EUR 3,780₮</span><span>Улаанбаатар −2°C</span></div></div>
      <header className="head">
        <div className="wrap">
          <Link href="/" className="logo">gogo<b>.</b>clone</Link>
          <form action="/search" className="search">
            <input name="q" placeholder="Мэдээ хайх..." aria-label="Мэдээ хайх" />
          </form>
        </div>
      </header>
      <Nav />
    </>
  );
}
