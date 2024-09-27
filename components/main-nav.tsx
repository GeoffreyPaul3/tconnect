import Image from "next/image"
import Link from "next/link"



export function MainNav() {
  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="flex items-center space-x-2">
        <Image src="/tlogo.png" alt="Logo" width={90} height={90}/>
      </Link>
    </div>
  )
}
