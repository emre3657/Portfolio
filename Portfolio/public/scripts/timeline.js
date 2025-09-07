document.addEventListener("DOMContentLoaded", () => {
  const tl = document.getElementById("timeline");
  if (!tl) return; // artık sorun yok, fonksiyon içindeyiz

  const items = Array.from(tl.querySelectorAll(".timeline-item"));
  const parse = (el, attr) => {
    const v = el.getAttribute(attr);
    return v ? new Date(v) : null;
  };

  items.sort((a, b) => {
    const aEnd = parse(a, "data-end");
    const bEnd = parse(b, "data-end");
    const aStart = parse(a, "data-start");
    const bStart = parse(b, "data-start");

    const aRef = aEnd || aStart;
    const bRef = bEnd || bStart;

    return bRef - aRef;
  });

  items.forEach((el) => tl.appendChild(el));
});
