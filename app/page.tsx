import Link from "next/link";

export default function Home() {
  return (
    <section>
      <p>Para aquellos que padecen el sindrome del "Fast Finger".</p>
      <p>Esos que no pueden aguantar más de 30 segundos escuchando una canción...</p>
      <p>Olvidate del botón de siguiente, dale al 'play' dejate llevar.</p>
      <Link href="/songs">
        <button>Go</button>
      </Link>
    </section>
  );
}
