import { readFileSync } from "fs";
import marked from "marked";
import { sanitizeHtml } from "./sanitizer";
import { ParsedRequest } from "./types";
const twemoji = require("twemoji");
const twOptions = { folder: "svg", ext: ".svg" };
const emojify = (text: string) => twemoji.parse(text, twOptions);

const rglr = readFileSync(`${__dirname}/../_fonts/WorkSans-Regular.woff2`).toString("base64");
const bold = readFileSync(`${__dirname}/../_fonts/WorkSans-Bold.woff2`).toString("base64");
const mono = readFileSync(`${__dirname}/../_fonts/Vera-Mono.woff2`).toString("base64");

function getCss(theme: string, fontSize: string) {
  const black = "#0f111a";
  const white = "#ffffff";
  const yellow = "#ffb626";

  let background = yellow;

  if (theme === "dark") {
    background = black;
  }

  return `
    @font-face {
        font-family: 'Work Sans';
        font-style: normal;
        font-weight: 400;
        src: url(data:font/woff2;charset=utf-8;base64,${rglr}) format('woff2');
    }

    @font-face {
        font-family: 'Work Sans';
        font-style: normal;
        font-weight: 600;
        src: url(data:font/woff2;charset=utf-8;base64,${bold}) format('woff2');
    }

    @font-face {
        font-family: 'Vera';
        font-style: normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${mono})  format("woff2");
    }

    body {
        background: ${background};
        font-size: 16px;
        height: 100vh;
        padding: 2rem 4rem;
        display: flex;
        text-align: center;
        align-items: center;
        align-content: stretch;
        justify-content: center;
    }

    code {
        color: #D400FF;
        font-family: 'Vera';
        white-space: pre-wrap;
        letter-spacing: -5px;
    }

    code:before, code:after {
        content: '\`';
    }

    .logo-wrapper {
        display: flex;
        align-items: center;
        align-content: center;
        justify-content: center;
        justify-items: center;
    }

    .logo {
        margin: 24px;
    }

    .plus {
        color: ${white};
        font-family: Times New Roman, Verdana;
        font-size: 100px;
    }

    .emoji {
        height: 1em;
        width: 1em;
        margin: 0 .05em 0 .1em;
        vertical-align: -0.1em;
    }

    .handle {
        font-family: 'Work Sans';
        font-size: 4rem;
        display: flex;
        flex-direction: column;
        align-self: flex-end;
        margin-top: 6rem;
        font-weight: 600;
        color: ${black};
        line-height: 1;
    }
    
    .heading {
        display: flex;
        font-family: 'Work Sans';
        font-size: ${sanitizeHtml(fontSize)};
        font-weight: 400;
        line-height: 1.4;
        color: ${white};
        font-weight: 400;
        background-color: ${black};
        padding: 0.5rem 1rem;
        padding: 0.5rem 1rem;
        border: 0.75rem solid ${white};
        box-shadow: 2rem 2rem 0 0 ${white};
    }`;
}

export function getHtml(parsedReq: ParsedRequest) {
  const { text, theme, md, fontSize, images, widths, heights } = parsedReq;
  return `<!DOCTYPE html>
<html>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        ${getCss(theme, fontSize)}
    </style>
    <body>
        <div>
            <div class="logo-wrapper">
                ${images
                  .map((img, i) => getPlusSign(i) + getImage(img, widths[i], heights[i]))
                  .join("")}
            </div>

            <div class="heading">${emojify(md ? marked(text) : sanitizeHtml(text))}
            </div>

            <div class="handle">@whitep4nth3r</div>
        </div>
    </body>
</html>`;
}

function getImage(src: string, width = "auto", height = "225") {
  return `<img
        class="logo"
        alt="Generated Image"
        src="${sanitizeHtml(src)}"
        width="${sanitizeHtml(width)}"
        height="${sanitizeHtml(height)}"
    />`;
}

function getPlusSign(i: number) {
  return i === 0 ? "" : '<div class="plus">+</div>';
}
