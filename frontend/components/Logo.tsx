import Image from "next/image";

export default function Logo() {
  return (
    <Image
      src="/calmry-logo-1.png"
      alt="Calmry logo"
      width={120}
      height={90}
      priority
    />
  );
}
