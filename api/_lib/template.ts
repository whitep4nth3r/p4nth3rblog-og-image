import { readFileSync } from "fs";
import marked from "marked";
import { sanitizeHtml } from "./sanitizer";
import { ParsedRequest } from "./types";
const twemoji = require("twemoji");
const twOptions = { folder: "svg", ext: ".svg" };
const emojify = (text: string) => twemoji.parse(text, twOptions);

const rglr = readFileSync(`${__dirname}/../_fonts/WorkSans-Regular.woff2`).toString("base64");
const bold = readFileSync(`${__dirname}/../_fonts/WorkSans-Bold.woff`).toString("base64");

function getCss(theme: string, fontSize: string) {
  const black = "#0f111a";
  const white = "#ffffff";
  const yellow = "#ffb626";
  const red = "#f11012";

  const backgroundColor = theme === "light" ? white : black;

  return `
    @font-face {
        font-family: 'Work Sans';
        font-style: normal;
        font-weight: 400;
        src: url(data:font/woff2;charset=utf-8;base64,${rglr}) format('woff2');
    }

    @font-face {
        font-family: 'Work Sans Bold';
        font-style: normal;
        font-weight: bold;
        src: url(data:font/woff2;charset=utf-8;base64,${bold}) format('woff2');
    }

    * {
        box-sizing: border-box;
        margin: 0;
        font-family: 'Work Sans';
    }

    body {
        background: ${backgroundColor};
        font-size: 16px;
        height: 1080px;
        width: 1920px;
    }

    .page {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        height: 100vh;
        border-top: 1rem solid  ${black};
        border-bottom: 1rem solid  ${black};
    }
    
    .page-inner {
        display: flex;
        flex-direction: column;
        align-content: space-between;
        height: 100vh;
        padding: 4rem;
        border-top: 0.5rem solid ${red};
        border-bottom: 0.5rem solid ${red};
    }

    .logoWrapper {
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        flex-grow: 0;
    }

    .text {
        display: flex;
        flex-direction: column;
        align-self: flex-start;
        font-family: "Work Sans Bold";
        text-transform: uppercase;
        font-size: ${sanitizeHtml(fontSize)};
        margin-top: 4rem;
        margin-bottom: 4rem;
    }

    .footer {
        display: flex;
        flex-direction: column;
        justify-items: center;
        align-items: flex-start;
        margin-top: auto;
    }

    .svgGroup__svg {
        margin-right: 1rem;
    }

    .svgGroup {
        display: flex;
    }

    .name {
        font-size: 42px;
        margin-bottom: 2rem;
        font-family: "Work Sans Bold";
    }
    `;
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
        <div class="page">
            <div class="page-inner">

                <div class="logoWrapper">
                    ${images
                      .map((img, i) => getPlusSign(i) + getImage(img, widths[i], heights[i]))
                      .join("")}
                </div>
               
                <div class="footer">
                    <div class="text">
                        ${emojify(md ? marked(text) : sanitizeHtml(text))}
                    </div>

                    <p class="name">@whitep4nth3r</p>
                    ${getSVGs()}
                </div>

            </div>
        </div>
    </body>
</html>`;
}

function getImage(src: string, width = "200", height = "200") {
  return `<img
        class="logoWrapper__logo"
        alt="Generated Image"
        src="${sanitizeHtml(src)}"
        width="${sanitizeHtml(width)}"
        height="${sanitizeHtml(height)}"
    />`;
}

function getPlusSign(i: number) {
  return i === 0 ? "" : '<div class="plus">+</div>';
}

function getSVGs() {
  return `<div className="svgGroup"><span class="svgGroup__svg">
    <svg xmlns="http://www.w3.org/2000/svg" height="60" width="60" viewBox="0 0 576 512" role="img" aria-label="YouTube logo">
        <rect x="50" y="100" fill="#ffffff" width="400" height="300" />
        <path fill="#ff0000" d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z">
        </path>
    </svg>
    </span>
    <span class="svgGroup__svg">
        <svg xmlns="http://www.w3.org/2000/svg" height="60" width="60" viewBox="0 0 248 204" role="img" aria-label="Twitter logo">
        <path
            fill="#1D9BF0"
            d="M221.95,51.29c0.15,2.17,0.15,4.34,0.15,6.53c0,66.73-50.8,143.69-143.69,143.69v-0.04
        C50.97,201.51,24.1,193.65,1,178.83c3.99,0.48,8,0.72,12.02,0.73c22.74,0.02,44.83-7.61,62.72-21.66
        c-21.61-0.41-40.56-14.5-47.18-35.07c7.57,1.46,15.37,1.16,22.8-0.87C27.8,117.2,10.85,96.5,10.85,72.46c0-0.22,0-0.43,0-0.64
        c7.02,3.91,14.88,6.08,22.92,6.32C11.58,63.31,4.74,33.79,18.14,10.71c25.64,31.55,63.47,50.73,104.08,52.76
        c-4.07-17.54,1.49-35.92,14.61-48.25c20.34-19.12,52.33-18.14,71.45,2.19c11.31-2.23,22.15-6.38,32.07-12.26
        c-3.77,11.69-11.66,21.62-22.2,27.93c10.01-1.18,19.79-3.86,29-7.95C240.37,35.29,231.83,44.14,221.95,51.29z"
        />
        </svg>
    </span>
    <span class="svgGroup__svg">
        <svg xmlns="http://www.w3.org/2000/svg" height="60" width="60" viewBox="0 0 2400 2800" role="img" aria-label="Twitch logo">
            <polygon
            fill="#ffffff"
            points="2200,1300 1800,1700 1400,1700 1050,2050 1050,1700 600,1700 600,200 2200,200 	"
            />
    
            <path
            fill="#9146FF"
            d="M500,0L0,500v1800h600v500l500-500h400l900-900V0H500z M2200,1300l-400,400h-400l-350,350v-350H600V200h1600
            V1300z"
            />
            <rect x="1700" y="550" fill="#9146FF" width="200" height="600" />
            <rect x="1150" y="550" fill="#9146FF" width="200" height="600" />
        </svg>
    </span></div>`;
}
