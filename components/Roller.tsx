"use client";

interface RollerProps {
  songs: any[];
  activeIndex: number;
}

export default function Roller({ songs, activeIndex }: RollerProps) {
  const nextTwo = activeIndex + 3;

  const getActiveClass = (index: number) => {
    if (index === activeIndex) return 'current active';
    if (index >= activeIndex && index < nextTwo) return 'active';
    return '';
  };

  return (
    <div className="roller">
      <ul>
        {songs.map((item, index) => (
          <li key={item.key} className={getActiveClass(index)}>
            <img src={item.image} alt={item.title} />
            <div className="content">
              <p>{item.title}</p>
              <p className="album">{item.album}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
