const tokens = [
  {text: "DATA:", row: 1, col: 1},
  {text: "s1", row: 1, col: 7},
  {text: "TYPE string,", row: 1, col: 10},

  {text: "s2 TYPE string.", row: 2, col: 7},

  {text: "s1", row: 4, col: 1},
  {text: "=", row: 4, col: 4},
  {text: "'Hello'", row: 4, col: 6},
  {text: ".", row: 4, col: 13},

  {text: "CONCATENATE", row: 5, col: 1},
  {text: "s1", row: 5, col: 13},
  {text: "' literal'", row: 5, col: 16},
  {text: "INTO", row: 5, col: 27},
  {text: "s2", row: 5, col: 32},
  {text: "RESPECTING BLANKS.", row: 5, col: 35},

  {text: "WRITE: /", row: 6, col: 1},
  {text: "s1", row: 6, col: 10},
  {text: ".", row: 6, col: 12},

  {text: "WRITE: /", row: 8, col: 1},
  {text: "s2", row: 8, col: 10},
  {text: ".", row: 8, col: 12},
]

const arrows18 = [
  {from: 6, to: 4},
  {from: 4, to: 9},
  {from: 9, to: 12},
  {from: 10, to: 12},
  {from: 12, to: 18},
];

const arrows15 = [
  {from: 6, to: 4},
  {from: 4, to: 15},
];

const arrows12 = [
  {from: 6, to: 4},
  {from: 4, to: 9},
  {from: 9, to: 12},
  {from: 10, to: 12},
];

const arrows9 = [
  {from: 6, to: 4},
  {from: 4, to: 9},
];

const arrows4 = [
  {from: 6, to: 4},
];

function run() {
  var draw = SVG().addTo('#drawing');
  draw.font({family: 'monospace', "font-size": 20});

  let paths = [];
  let highlight = undefined;
  let maxWidth = 0;
  let maxHeight = 0;
  let i = 0;

  for (const t of tokens) {
    var text = draw.plain(t.text);
    text.attr('y', t.row + "em");
    text.attr('x', t.col - 1 + "ch");
    text.attr("tokenNumber", i);
    t.bbox = text.bbox();

    text.mouseover((e) => {
      const num = e.srcElement.attributes.tokenNumber.value;
      const bbox = tokens[num].bbox;

      for (const p of paths) {
        p.remove();
      }
      paths = [];

      highlight = draw.line(bbox.x, bbox.y2, bbox.x2, bbox.y2);
      highlight.stroke({ color: 'red', width: 2, linecap: 'round', linejoin: 'round', "opacity": '0.5'});

      switch(num) {
        case "4":
          paths = drawArrows(draw, arrows4);
          break;
        case "9":
          paths = drawArrows(draw, arrows9);
          break;
        case "12":
          paths = drawArrows(draw, arrows12);
          break;
        case "15":
          paths = drawArrows(draw, arrows15);
          break;
        case "18":
          paths = drawArrows(draw, arrows18);
          break;
      }
    });

    text.mouseout((e) => {
      highlight.remove();

      for (const p of paths) {
        p.remove();
      }
      paths = [];
    });

    maxWidth = Math.max(maxWidth, t.text.length + t.col);
    maxHeight = Math.max(maxHeight, t.row + 1);

    i++;
  }

  draw.size(maxWidth + "ch", maxHeight + "em");

  paths = drawArrows(draw, arrows18);
}

function drawArrows(draw, arrows) {
  const ret = [];

  for (const a of arrows) {
    const from = tokens[a.from];
    const to = tokens[a.to];

    if (from.row === to.row && from.col > to.col) {
      // up, left
      firstX = from.bbox.cx - 20;
      firstY = from.bbox.cy - 20;
      // up, right
      secondX = to.bbox.cx + 20;
      secondY = to.bbox.cy - 20;
    } else if (from.row < to.row && from.col < to.col) {
      // down, right
      firstX = from.bbox.cx + 20;
      firstY = from.bbox.cy + 20;
      // up, left
      secondX = to.bbox.cx - 20;
      secondY = to.bbox.cy - 20;
    } else if (from.row === to.row && from.col < to.col) {
      // up, right
      firstX = from.bbox.cx + 20;
      firstY = from.bbox.cy - 20;
      // up, left
      secondX = to.bbox.cx - 20;
      secondY = to.bbox.cy - 20;
    } else if (from.row < to.row && from.col > to.col) {
      // down, left
      firstX = from.bbox.cx - 20;
      firstY = from.bbox.cy + 20;
      // up, right
      secondX = to.bbox.cx + 20;
      secondY = to.bbox.cy - 20;
    } else {
      console.log("unknown direction");
    }

    const sPath = "M " + from.bbox.cx + " " + from.bbox.cy + " C " + firstX + " " + firstY + ", " + secondX + " " + secondY + ", " + to.bbox.cx + " " + to.bbox.cy;

    var path = draw.path(sPath);
    path.fill('none');
    path.stroke({ color: 'blue', width: 4, linecap: 'round', linejoin: 'round', "opacity": '0.5'});
    ret.push(path);
  }

  return ret;
}

SVG.on(document, 'DOMContentLoaded', function() {
  run();
});

