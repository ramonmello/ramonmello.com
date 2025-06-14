import { GitHubIcon, LinkedInIcon } from "@/src/shared/components/icons";
import Image from "next/image";

const avatarBlurDataURL =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAoHBwgHBgoICAgLCgoLDhgQDg0NDh0VFhEYIx8lJCIfIiEmKzcvJik0KSEiMEExNDk7Pj4+JS5ESUM8SDc9Pjv/2wBDAQoLCw4NDhwQEBw7KCIoOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozv/wAARCAAoACgDASIAAhEBAxEB/8QAGwAAAgIDAQAAAAAAAAAAAAAAAAUGBwECBAP/xAAsEAABAwMCBAUEAwAAAAAAAAABAgMEAAURBiESMUFRBxMiYYEUMnGRFUKh/8QAGAEBAQEBAQAAAAAAAAAAAAAAAAMCBAj/xAAeEQACAgIDAQEAAAAAAAAAAAAAAQIRAyESMUEiUf/aAAwDAQACEQMRAD8AuWiiigAUrumcMxHUmVIDEYHCCFcSj+qAcnFLtU63g6dZSh1D0uWvPkx2xla8dSf6pHc8mqo1JrG9XuSt+VcpKGicpYZcUlCB2CQcbdzkntTjByFyRbb13tjIIRJdfUOYYaU4R8A4+aRzfETT0VRSjz5RAyQwylQP5VgfvFQRgr8sLfcUtfJJBIHYbbUsrLGjN8nQuTTEyZ4v3IqP8fbmGwTgGQ4VEfCcD9Zp7Z9dWK5uBhcgxZB/q6MJJ9lA4B9iRnsar6xad+pcLspXFw7hJGAkdSfYUznWJcWKpRWVLCFYKkYCnCduFI5kHmew61WVqKSEXbo9G6KRaP1HDv8ADQ40UszGA2HpCEEBeMkBYPJQycHBwOYyM00qLTT2VCDWdwlMWdluG+WJVT5JZKSEJ7EnOQrO4IGTVc26OqHFSl+UpceRy5Yk/JwkD8D3qz9ZWf8AmLK7CWvynN0OgcoqdlgHt90d1H3qq7VGdNzts6UylXl7uvDKyOXCjc4GMnY7dxuMxWC+V8kRzdnK2S6vRxuP5n5qZTXGnXHwxU8pRkL/AJvvX8/6KK2KNFNn/9k=";

export function Sidebar() {
  return (
    <div className="mb-11 md:mb-0 lg:sticky lg:h-[calc(100vh-345px)] lg:flex lg:flex-col top-36 w-full lg:w-6/12">
      <Image
        src="/ramon-avatar.jpg"
        alt="Ramon Mello - Front-end Developer"
        width={250}
        height={250}
        className="mb-10 rounded-3xl"
        priority={true}
        placeholder="blur"
        blurDataURL={avatarBlurDataURL}
        sizes="(max-width: 768px) 100vw, 250px"
      />
      <h1 className="font-bold text-5xl">Ramon Mello</h1>
      <p className="text-xl font-light">Full-Stack Developer</p>
      <p className="mt-4 text-base max-w-md text-neutral-400">
        Há mais de sete anos, projeto e desenvolvo interfaces que conectam
        estratégias de produto à experiência do usuário. Já liderei e colaborei
        com squads multidisciplinares, atuando como elo entre design, dados e
        negócios para converter insights em soluções rápidas, acessíveis e
        escaláveis. Mais do que escrever código, estudo a jornada e o
        comportamento dos usuários para validar hipóteses e embasar decisões
        técnicas, garantindo valor real para quem usa as soluções desenvolvidas.
      </p>

      <div className="flex gap-4 mt-4">
        <a
          className="flex"
          href="https://github.com/ramonmello"
          target="_blank"
          rel="noopener noreferrer"
        >
          <GitHubIcon />
        </a>
        <a
          className="flex"
          href="https://www.linkedin.com/in/ramonmello/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <LinkedInIcon />
        </a>
      </div>
    </div>
  );
}
