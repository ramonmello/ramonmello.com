export function GameControlsGuide() {
  return (
    <div className="absolute bottom-24  md:bottom-14 left-1/2 -translate-x-1/2 font-lores-12">
      <div className="hidden md:block">
        <span className="font-nimbus">← →</span> : Girar |{" "}
        <span className="font-nimbus">↑</span> : Acelerar |{" "}
        <span className="font-nimbus">Espaço</span> : Disparar
      </div>
      <div className="md:hidden w-52">Acesse pelo PC para jogar!</div>
    </div>
  );
}
