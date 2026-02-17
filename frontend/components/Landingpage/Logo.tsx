import Image from "next/image";

export default function Logo() {
  return (
    <Image
      src="/logo-calmry.png"
      alt="Calmry logo"
      width={80}
      height={80}
      priority
    />
  );
}
