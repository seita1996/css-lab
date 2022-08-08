// @ts-check
export class SplitText {
  /**
   * @class SplitText
   * @constructor
   * @param {String} els - 対象要素（メイン）
   * @param {Object} [Options] - オプション
   * @param {any} [Options.target] - 対象要素（複数行の場合は行ごとに指定）
   * @param {Array} [Options.transition] - トランジションディレイがある場合は指定 (ms)
   * @param {Array} [Options.animation] - アニメーションディレイがある場合は指定 (ms)
   *
   * @example
    new SplitText(".js-s-block", {
      target: ".js-s-text",
      transition: [800],
    });
   */

  // transition, animationはどちらか一方だけ指定する
  constructor(els, { target = false, transition, animation } = {}) {
    this.els = document.querySelectorAll(els);
    console.log('hoge', this.els[0])

    if (!this.els) {
      console.error(`SplitText: ${els} が見つかりませんでした。`);
      return;
    }

    this.transition = transition;
    this.animation = animation;

    // 対象要素が複数行の場合は、それぞれに対応する
    // テキストを分割する
    this.els.forEach((element) => {
      this.target = target ? element.querySelectorAll(target) : this.els;

      this.target.forEach((target) => {
        // const span = document.createElement("span");
        // span.innerHTML = target.innerHTML;
        // span.classList.add("visuallyHidden");
        // target.insertAdjacentElement("afterend", span);

        this.chars = target.innerHTML.trim().split("");
        target.innerHTML = this._splitText();
      });
    });

    // ディレイを付与する
    if (this.transition || this.animation) {
      this._charsAddDelay();
    }
  }

  _splitText() {
    return this.chars.reduce((acc, curr) => {
      if (curr === "＆") {
        curr = curr.replace("＆", "&amp;");
      } else if (curr === /\s+/) {
        curr = curr.replace(/\s+/, "&nbsp;");
      }

      return `${acc}<span class="char" aria-hidden="true">${curr}</span>`;
    }, "");
  }

  _charsAddDelay() {
    this.els.forEach((element) => {
      const chars = element.querySelectorAll(".char");
      const transition = this.transition;
      const animation = this.animation;

      chars.forEach((char, index) => {
        let transitionDelayTime;
        let animationDelayTime;

        if (transition) {
          if (transition.length === 1) {
            transitionDelayTime = Math.round(transition[0] * index) / 1000 + "s";
          } else {
            transitionDelayTime = (() => {
              return transition.reduce((acc, curr) => {
                const diff = curr - acc;
                return `${Math.round(acc * index) / 1000}s, ${Math.round(acc * index + diff) / 1000}s`;
              });
            })();
          }
        }
        if (animation) {
          if (animation.length === 1) {
            animationDelayTime = Math.round(animation[0] * index) / 1000 + "s";
          } else {
            animationDelayTime = (() => {
              return animation.reduce((acc, curr) => {
                const diff = curr - acc;
                return `${Math.round(acc * index) / 1000}s, ${Math.round(acc * index + diff) / 1000}s`;
              });
            })();
          }
        }

        if (this.animation && this.transition) {
          char.setAttribute("style", `animation-delay: ${animationDelayTime}; transition-delay: ${transitionDelayTime};`);
        } else if (this.animation) {
          char.setAttribute("style", `animation-delay: ${animationDelayTime};`);
        } else if (this.transition) {
          char.setAttribute("style", `transition-delay: ${transitionDelayTime};`);
        }
      });
    });
  }
}