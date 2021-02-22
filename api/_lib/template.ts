import { readFileSync } from "fs";
import marked from "marked";
import { sanitizeHtml } from "./sanitizer";
import { ParsedRequest } from "./types";
const twemoji = require("twemoji");
const twOptions = { folder: "svg", ext: ".svg" };
const emojify = (text: string) => twemoji.parse(text, twOptions);

const rglr = readFileSync(`${__dirname}/../_fonts/WorkSans-Regular.woff2`).toString("base64");

function getCss(theme: string, fontSize: string) {
  const black = "#0f111a";
  const white = "#ffffff";
  const yellow = "#ffb626";
  const red = "#f11012";

  const backgroundColor = theme === "light" ? red : black;
  const backgroundImageUrl =
    theme === "light"
      ? "https://p4nth3rlabs.netlify.app/assets/bg-red-169.png"
      : "https://p4nth3rlabs.netlify.app/assets/bg-black-169.png";

  return `
    @font-face {
        font-family: 'Work Sans';
        font-style: normal;
        font-weight: 400;
        src: url(data:font/woff2;charset=utf-8;base64,${rglr}) format('woff2');
    }

    body {
        background: ${backgroundColor};
        background-image: url(${backgroundImageUrl});
        background-position: center;
        background-size: cover;
        font-size: 16px;
        height: 100vh;
        padding: 6rem 4rem;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        text-align: center;
        align-items: center;
        justify-content: center;
    }

    .logo-wrapper {
        display: flex;
        align-items: center;
        align-content: center;
        justify-content: center;
        justify-items: center;
        flex-direction: column;
        position: relative;
        margin-bottom: 1rem;
    }

    .logo {

    }

    .logo-banner {
        width: 400px;
        position: absolute;
        bottom: -48px;
    }

    .plus {
        color: ${white};
        font-family: 'Work Sans';
        font-size: 100px;
    }

    .footer {
        background-color: ${white};
        color: ${black};
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        align-content: center;
        width: 100%;
        box-sizing: border-box;
        padding: 0.5rem;
        font-size: 42px;
    }

    .heading-inner {
        padding: 2.5rem 2rem;
    }
    
    .heading {
        display: block;
        font-family: 'Work Sans';
        font-size: ${sanitizeHtml(fontSize)};
        font-weight: 400;
        line-height: 1.4;
        color: ${white};
        font-weight: 400;
        background-color: ${black};
        width: 100%;
        box-sizing: border-box;
        border: 0.75rem solid ${white};
        border-bottom-width: 0;
        box-shadow: 1.75rem 1.75rem 0 0 ${yellow};
        margin-bottom: 8rem;
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
        <div class="logo-wrapper">
            ${images
              .map((img, i) => getPlusSign(i) + getImage(img, widths[i], heights[i]))
              .join("")}
              <img src="https://p4nth3rlabs.netlify.app/assets/svgs/banner.svg" alt="whitep4nth3r banner" class="logo-banner" />
        </div>

        <div class="heading">
            <div class="heading-inner">
                ${emojify(md ? marked(text) : sanitizeHtml(text))}
            </div>
            <div class="footer">whitep4nth3r.com</div>
        </div>
    </body>
</html>`;
}

function getImage(src: string, width = "300", height = "300") {
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
