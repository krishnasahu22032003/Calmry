import Image from "next/image";

export default function Logo() {
  return (
    <Image
      src="/calmry-logo.png"
      alt="Calmry logo"
      width={40}
      height={40}
      priority
    />
  );
}
