// @ts-check
import { SplitText } from "./SplitText.js";

document.addEventListener("DOMContentLoaded", () => {
  new SplitText(".js-split-block", {
    target: ".js-split-text",
    animation: [300]
  });
});