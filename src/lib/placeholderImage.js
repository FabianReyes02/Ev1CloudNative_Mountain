const svg = `
<svg xmlns='http://www.w3.org/2000/svg' width='600' height='750'>
  <rect width='100%' height='100%' fill='#152033'/>
  <circle cx='300' cy='330' r='85' fill='#24344d'/>
  <path d='M0 640 L170 470 L270 560 L380 450 L600 620 L600 750 L0 750 Z' fill='#24344d'/>
  <text x='300' y='560' font-family='Inter, sans-serif' font-size='17' letter-spacing='2' fill='#64748b' text-anchor='middle'>SUMMITLAB</text>
</svg>`;

export const PLACEHOLDER_IMAGE = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;

export const handleImageError = (event) => {
  if (event.currentTarget.src !== PLACEHOLDER_IMAGE) {
    event.currentTarget.src = PLACEHOLDER_IMAGE;
  }
};