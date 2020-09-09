import React from 'react';
import { debounce } from 'lodash';

class BgAnimation extends React.Component {
  constructor(props) {
    super(props);
    this.step = (2 * Math.PI) / this.chunk;
  }
  chunk = 50;
  step = 0;
  point(r, angle, cw, cy, x, y) {
    var ret = { x: 0, y: 0 };
    ret.x = x - cw + Math.cos(angle) * r;
    ret.y = y - cy + Math.sin(angle) * r;
    return ret;
  }

  generateAngle(_x1, _y1) {
    let angles = [];
    for (let i = 0; i <= this.chunk; i++) {
      angles.push(this.step * i);
    }
    return angles;
  }

  /*
   * r: 半径
   * cw: 实物半径
   * x: 原点
   * y: 原点
   * x1: 实物起始
   * y1: 实物起始
   */
  generateStep(name, r, cw, cy, x, y, x1, y1) {
    let angles = this.generateAngle(x1, y1);
    let step = '';

    angles.forEach((angle, index) => {
      let point = this.point(r, angle, cw, cy, x, y);
      let percentage = 2 * index;

      let _angles = 180 / (Math.PI / angle);
      let len = angles.length - 1;
      if (len == index) {
        percentage = 100;
      }

      step += `${percentage}%   {
                opacity:1;
                transform: translate(${point.x}px, ${point.y}px) rotate(${_angles}deg);
                -ms-transform: translate(${point.x}px, ${point.y}px) rotate(${_angles}deg);
                -moz-transform: translate(${point.x}px, ${point.y}px) rotate(${_angles}deg);
                -webkit-transform: translate(${point.x}px, ${point.y}px) rotate(${_angles}deg);
                -o-transform: translate(${point.x}px, ${point.y}px) rotate(${_angles}deg);
              }\n`;
    });

    let content = `@keyframes ${name}
    {
      ${step}
    }\n`;

    content += `@-ms-keyframes ${name}
    {
      ${step}
    }\n`;

    content += `@-moz-keyframes ${name}
    {
      ${step}
    }\n`;

    content += `@-webkit-keyframes ${name}
    {
      ${step}
    }\n`;

    content += `@-o-keyframes ${name}
    {
      ${step}
    }\n`;

    return content;
  }

  generateAnimate() {
    let loginAnimate = 'login-animate-style';
    let styleNode = document.getElementById(loginAnimate);
    if (styleNode) {
      styleNode.innerHTML = '';
    }

    //用户自定义样式
    if (!styleNode) {
      let heads = document.getElementsByTagName('head');
      styleNode = document.createElement('style');
      styleNode.setAttribute('id', loginAnimate);
      styleNode.setAttribute('type', 'text/css');
      styleNode.setAttribute('rel', 'stylesheet');
      heads[0].appendChild(styleNode);
    }

    let width = window.innerWidth;
    let content = '';
    //火箭1
    if (width <= 1680) {
      content += this.generateStep(
        'rocket1',
        200,
        12.5,
        19,
        225,
        225,
        225,
        225
      );
      content += this.generateStep('rocket2', 175, 15, 30, 225, 225, 225, 225);
      content += this.generateStep('star1', 225, 9, 9, 225, 225, 225, 225);
      content += this.generateStep('star2', 250, 14, 14, 225, 225, 225, 225);
    } else {
      content += this.generateStep('rocket1', 300, 19, 29, 344, 344, 344, 344);
      content += this.generateStep('rocket2', 275, 30, 60, 344, 344, 344, 344);
      content += this.generateStep('star1', 325, 9, 9, 344, 344, 344, 344);
      content += this.generateStep('star2', 350, 14, 14, 344, 344, 344, 344);
    }

    styleNode.innerHTML = content;
  }

  componentDidMount() {
    this.generateAnimate();
    window.onresize = debounce(() => {
      this.generateAnimate();
    }, 200);
  }

  render() {
    return (
      <div
        className="layer-wrap"
      >
        <div className="layer-city" />
        <div className="layer">
          <div className="layer-rocket1" />
          <div className="layer-pathway1" />
        </div>
        <div className="layer">
          <div className="layer-rocket2" />
          <div className="layer-pathway2" />
        </div>
        <div className="layer">
          <div className="layer-star1" />
          <div className="layer-pathway3" />
        </div>
        <div className="layer">
          <div className="layer-star2" />
          <div className="layer-pathway4" />
        </div>
      </div>
    );
  }
}

export default BgAnimation;
