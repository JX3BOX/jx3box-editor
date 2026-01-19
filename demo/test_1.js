export default`
<style>
:root {
  --background: #fff;
  --text-color: rgb(61,69,77);
  --highlight-text: #040406;
}

@media (prefers-color-scheme: dark) {
  --text-color: rgb(192,198,204);
  --highlight-text: #d4d4d6;
}

.c-article-tinymce, .c-article-box, .c-article, .c-article-editor {
  background: var(--background);
  color: var(--text-color);
}

.tooltip {
  position: relative;
  display: inline-block;
  cursor: pointer;
}

.tooltip .tooltip-text {
  visibility: hidden;
  background: linear-gradient(to right, rgba(255, 255, 255, 0.85), white, white, rgba(255, 255, 255, 0.85) );
  padding: 8px;
  border-radius: 10px;
  position: absolute;
  z-index: 1;
  opacity: 0;
  transition: opacity 0.3s;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  text-shadow: 0.5px 0.5px 1px rgba(0, 0, 0, 0.25);
}

.tooltip-top .tooltip-text {
  bottom: 115%;
  left: 50%;
  transform: translateX(-50%);
  font-size: 14px;
}

.tooltip-top .tooltip-text::after {
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-color: white transparent transparent transparent;
}

.tooltip:hover .tooltip-text {
  visibility: visible;
  opacity: 1;
}

.auto-padding {
  padding-left: 40px;
}

.auto-padding-2 {
  padding-left: 155px;
}

.golden-name {
  font-size: 20px;
  font-weight: 800;
  text-shadow: 0.5px 0.5px 1px rgba(248, 168, 16, 0.3);
  border-bottom: 2px solid rgba(248, 168, 16, 0.4);
  border-radius: 4px; 
}

.common-name {
  font-size: 20px;
  font-weight: 600;
}

.e-summary {
  border: none;
  background: linear-gradient(to right, rgba(104, 24, 138, 0.45), rgba(104, 80, 120, 0.2), rgba(120, 120, 120, 0.1));
  box-shadow: 0 4px 8px rgba(104, 104, 104, 0.1);
  /* background: linear-gradient(to right, rgba(104, 24, 138, 0.45), rgba(168, 72, 192, 0.3), transparent); */
  /* box-shadow: 0 4px 8px rgba(120, 24, 158, 0.3); */
  color: #ffffff; 
  text-shadow: 0.5px 0.5px 1px rgba(104, 24, 138, 0.2); 
  font-weight: 600;
}

.e-details {
  border: none; 
  border-radius: 0 0 10px 10px; 
  box-shadow: 0 4px 8px rgba(104, 104, 104, 0.1);
}

.e-summary::after {
  display: none;
  visibility: hidden;
}

.e-summary::before {
  display: none;
  visibility: hidden;
}

.tag {
  color: #f0f0f0;
  background-color: #538aec;
  text-shadow: 0.5px 1px 0.5px rgba(0, 0, 0, 0.25);
  padding: 2px 3px;
  margin: 0 2px;
  border-radius: 2px;
  font-family: 等线;
  font-weight: 500;
}

.tag-gold {
  background: #eeaa10;
  color: #efffef;
}

.tag-yellow {
  background: #efbe40;
  color: #efffef;
}

.tag-green {
  background: #279027;
}

.tag-red {
  background: #ef8080;
  color: #ffffff;
}

.tag-red-blue {
  background: linear-gradient(135deg,#ef8080,#538aec);
  color: #f8ffef;
}

.tag-pink-gold {
  background: linear-gradient(135deg,#ff9b1a, #ff80f0);
  color: #f8ffef;
}

.tag-purple {
  background: #7a31aa;
}

.tag-gray {
  background: #989899;
}

.tag-cyan {
  background: #9999cc;
}

.tag-number {
  background: #fafafb;
  color: #707078;
  border: 1px solid #b0b0b0;
  border-radius: 4px;
}

.highlight {
  background: linear-gradient(to bottom,
    transparent,
    transparent 40%,
    rgba(228, 212, 248, 0.6) 40%,
    rgba(220, 204, 240, 0.8) 60%,
    rgba(200, 188, 220, 0.6) 80%,
    rgba(192, 180, 220, 0.4) 100%);
  font-weight: 500;
  text-shadow: 0.5px 0.5px 0.5px rgba(0, 0, 0, 0.1);
  color: var(--highlight-text);
  border-radius: 8px 8px 12px 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  padding: 0 4px;
  margin: 0 2px;
}

.highlight-gold {
  background: linear-gradient(to bottom,
    transparent,
    transparent 40%,
    rgba(240, 222, 120, 0.5) 40%,
    rgba(240, 192, 108, 0.5) 60%,
    rgba(248, 172, 96, 0.4) 80%,
    rgba(255, 128, 40, 0.3) 100%);
}

.highlight-green {
  background: linear-gradient(to bottom,
    transparent,
    transparent 40%,
    rgba(180, 240, 180, 0.5) 40%,
    rgba(180, 248, 180, 0.45) 60%,
    rgba(140, 240, 140, 0.45) 80%,
    rgba(100, 220, 100, 0.45) 100%);
}

.highlight:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.12);
}

.cards-container {
  display: flex;
  max-width: 1000px;
  flex-direction: column;
  gap: 15px;
  padding: 15px 0;
}

.cards {
  display: flex;
  gap: 15px;
}

.card {
  background: transparent;
  border-radius: 8px;
  color: rgb(60, 60, 71);
  font-size: 15px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  text-shadow: 0.5px 0.5px 0.5px rgba(60, 60, 60, 0.05); 
  padding: 10px;
  transition: all 0.3s ease;
  overflow: hidden;
  position: relative;
}

.card-gold {
  width: 200px;
  background: linear-gradient(135deg,
    rgba(240, 192, 120, 0.8) 0%,
    transparent 40%,
    transparent 70%,
    rgba(240, 192, 120, 0.8) 100%);
  box-shadow: 0 10px 25px rgba(255, 160, 0, 0.35);
}

.card-purple {
  width: 200px;
  background: linear-gradient(135deg,
    rgba(232, 216, 252, 0.8) 0%,
    transparent 40%,
    transparent 70%,
    rgba(232, 216, 252, 0.8) 100%);
  box-shadow: 0 8px 20px rgba(232, 216, 252, 0.2);
}

.card-blue {
  width: 156.67px;
  background: linear-gradient(135deg,
    rgba(128, 205, 248, 0.45) 0%,
    transparent 40%,
    transparent 70%,
    rgba(128, 205, 248, 0.45) 100%);
  box-shadow: 0 8px 20px rgba(128, 205, 248, 0.2);
}

.card-green {
  width: 160px;
  background: linear-gradient(135deg,
    rgba(160, 220, 160, 0.55) 0%,
    transparent 40%,
    transparent 70%,
    rgba(160, 220, 160, 0.55) 100%);
  box-shadow: 0 8px 20px rgba(160, 220, 160, 0.2);
}

.card-gray {
  width: 127px;
  background: linear-gradient(135deg,
    rgba(128, 128, 128, 0.55) 0%,
    rgba(128, 128, 128, 0.25) 35%,
    rgba(128, 128, 128, 0.25) 70%,
    rgba(128, 128, 128, 0.55) 100%);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.card:hover {
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
}
.card-gold:hover {
  box-shadow: 0 16px 40px rgba(128, 60, 0, 0.4);
}

@media (max-width: 768px) {
  .cards {
    flex-direction: row;
    flex-wrap: wrap;
  }
  .auto-padding {
    padding-left: 0px;
  }
  .auto-padding-2 {
    padding-left: 10px;
  }
  .e-summary, .e-details {
    margin: 0;
  }

}

</style>
<div class="e-summary" style="margin: 0 20px; margin-top: 5px;">叠甲</div>
<div class="e-details" style="margin: 0 20px; font-family: 等线;">
<p>本文内容适用于赛季「山海源流」。</p>
<div>本文作者小莴苣，将尽力确保内容之准确，然因个人水平或疏漏等问题，或仍将存在错误，敬请斧正。除特别声明外，遵循&nbsp;<a title="CC BY-NC-ND 4.0 License" href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noopener">CC BY-NC-SA 4.0 License</a> 。</div>
<div><span style="font-size: 1em;">以下内容基于山海源流体服三改Beta<sup>(10/17)</sup>进行，或将因游戏更新等问题出现部分错误，我将在尽可能早的时间内追踪更新。</span></div>
</div>
<div class="e-summary" style="margin: 0 20px; margin-top: 5px;">Update Logs | Latest: ﹝12/20﹞ 计算器新增武学助手；更新连缘奇穴下的三段加速相关说明。</div>
<div class="e-details" style="margin: 0 20px; font-family: 等线;">
<p>12/20 - 计算器新增武学助手；更新连缘奇穴下的三段加速相关说明。</p>
<p>11/25 - 更新悸心相关，与无修相关的头、鞋、项链和腰坠参考；修改部分内容。</p>
<p>11/04 - 更新图标、配装参考。</p>
<p>11/03 - 样式优化，使虚线变得更明显。</p>
<p>10/30 - Public Release</p>
<p>10/29 - 大体完成。</p>
<p>10/28 - 主要内容完成，开始制作装备详细参考。</p>
<p>10/27 - 开文；完成主要结构；完成大部分主体样式编辑。</p>
</div>
<div style="text-align: center; padding: 80px 0;"><span style="text-shadow: 0.5px 0.5px 1px rgba(48, 48, 48, 0.15); font-size: 1.25em;">请善用右方箭头导读栏以方便你的查阅。如需更详细的配装收益取舍，敬请移步<a title="计算器" href="https://www.jx3box.com/bps/79885" target="_blank" rel="noopener">计算器</a>。</span><br /><span style="font-size: 1em; border-radius: 8px; border-left: 2px solid #3c64bc90; border-right: 2px solid #3c64bc90; color: #5777af99; padding: 0 10px;">因魔盒页面样式相关内容可能正在更新中，目前 CH.3 暂无法阅读，敬请谅解 </span></div>
<div>
<h1>零、配装参考</h1>
<p><img src="https://cdn.jx3box.com/upload/post/2025/11/25/125668_2874531.png" /></p>
<p><img src="https://cdn.jx3box.com/upload/post/2025/11/25/125668_6482687.png" /></p>
<hr />
<p><img src="https://cdn.jx3box.com/upload/post/2025/11/4/125668_8509875.png" /></p>
<p>&nbsp;</p>
</div>
<hr />
<p style="text-align: center;"><span style="font-size: 22px;">正文</span></p>
<h1>一、版本更迭带来的变化</h1>
<h2>1. 装备模型的变更</h2>
<div class="auto-padding">
<p>在「山海源流」赛季，对部分属性模型进行了调整，导致了部分装备选择序列和上赛季略有出入（比如精简破无）。</p>
<p>这是一件好事，装备选择的空间更大了。不会出现过渡装备也无甚可选的情况。</p>
<p>&nbsp;</p>
</div>
<h2>2. 虫兽的移除</h2>
<div class="auto-padding">
<p>虫兽的移除直接导致了毒经基础攻击收益的降低，基础增益从<span class="tag tag-number">35%</span>骤降至<span class="tag tag-number">25%</span>。</p>
<p>这也意味着基础攻击对于毒经不再是一个非常高贵的属性，但也因为仍有保留，不至于跟根骨一桌。</p>
<p>&nbsp;</p>
</div>
<h2>3. 破招和无界</h2>
<div class="auto-padding">
<p>在改动后破招的收益回到了正常偏低（接近此前蛇香）的情况。旗舰可以酌情选择部分带破招装备了。</p>
<p>无界没有变化，还是要尽量避免，蝎心流派可以选择五属性，五属性的容量太高了。</p>
<p>&nbsp;</p>
</div>
<h1>二、配装方向</h1>
<h2>1. 门派套装</h2>
<div class="auto-padding">
<p>在新赛季，无论是连令或是降厄，蝎心蛇影的占比都已大幅降低，四件套的加成相对疲弱，但也尚可。</p>
<p>因此<span class="highlight">通常建议选择四件套</span><span style="color: #aaaaaa;">（头、衣、腰、鞋）</span>。</p>
<p>有<span class="highlight highlight-green">尚可的无修头</span>或选择<span class="highlight highlight-green">加速头/衣服</span> + <span class="highlight highlight-green">较优的腰带精简</span>即可以选择两件套<span style="color: #aaaaaa;">（衣 / 头、鞋）</span>。</p>
<p>&nbsp;</p>
</div>
<h2>2. 加速段位</h2>
<div class="auto-padding">
<h3>旗舰端</h3>
<p style="padding-left: 5px;"><span style="font-size: 16px; font-family: 等线, sans-serif; text-shadow: 0.5px 0.5px 0.5px rgba(0, 0, 0, 0.1); padding: 2px 3px; border-radius: 3px; background: #f7f2fa; border: 1px solid #d1c2e9; color: #78429c;">连令</span> 推荐 9232 / 19285 加速。提升加速段位可以避免部分情况的拖轴。<span class="highlight">武学助手为此流派。</span></p>
<p style="padding-left: 5px;"><span style="font-size: 16px; font-family: 等线, sans-serif; text-shadow: 0.5px 0.5px 0.5px rgba(0, 0, 0, 0.1); padding: 2px 3px; border-radius: 3px; background: #f2fbf8; border: 1px solid #d0eeda; color: rgba(40, 127, 65);">悸心</span> 推荐 9232 加速。</p>
<p style="padding-left: 5px;"><span style="font-size: 16px; font-family: 等线, sans-serif; text-shadow: 0.5px 0.5px 0.5px rgba(0, 0, 0, 0.1); padding: 2px 3px; border-radius: 3px; background: #f2f7fb; border: 1px solid #c0d8ea; color: #3b75a5;">降厄</span> 推荐 21131 加速，不推荐高延迟尝试。</p>
<h3>无界端</h3>
<p style="padding-left: 5px;"><span style="font-size: 16px; font-family: 等线, sans-serif; text-shadow: 0.5px 0.5px 0.5px rgba(0, 0, 0, 0.1); padding: 2px 3px; border-radius: 3px; background: #f7f2fa; border: 1px solid #d1c2e9; color: #78429c;">蛇蝶</span> 推荐 14156 加速。</p>
<p style="padding-left: 5px;"><span style="font-size: 16px; font-family: 等线, sans-serif; text-shadow: 0.5px 0.5px 0.5px rgba(0, 0, 0, 0.1); padding: 2px 3px; border-radius: 3px; background: #f2f7fb; border: 1px solid #c0d8ea; color: #3b75a5;">蝎蝶</span> 推荐 9232 加速。</p>
<p style="padding-left: 5px;">&nbsp;</p>
</div>
<h2>3. 属性收益</h2>
<div class="auto-padding">
<h3>旗舰端</h3>
<p>在奇穴调整后，基础收益回落，而无双并无变动。与此前同样，因属性容量的问题，会效依旧高得夸张。<span style="color: #aaaaaa;">（而且还移除了唯一的双会奇穴）</span></p>
<p>可以说实际属性收益和之前相差不多，惟基础下降。毕业仍旧是会破无攻基本均衡，无双略有优势，根骨破招垫底。</p>
<p>破招仅接受部分属性模型较优的装备有一点，不要刻意去追求破招。</p>
<p>属性容量的提高也使得部分数值接近拐点。需要特别关注的是会心，黄字会无装备会提供大量的会心，在会心接近或超过 70% 后，就不宜再选配了。</p>
<hr />
<h3>无界端</h3>
<p>无界端完全没有改动，唯一的变数是蛇蝶流现在也可供选择。</p>
<p>蝎蝶的<span class="highlight">破招收益仍然很低</span>，而<span class="highlight highlight-gold">蛇蝶更是完全没有收益</span>，只有这一点需要特别注意。</p>
<hr />
<p>收益基于各配装实际情况各不相同，无法笼统地给出一个排序，</p>
<p>实际上你<span class="highlight">只需要看计算器哪件装备DPS高</span>就可以轻巧地做出选择了。</p>
<p>&nbsp;</p>
</div>
<h2>4. 计算器相关</h2>
<div class="auto-padding">
<p>计算器现已支持：</p>
<h3>旗舰端</h3>
<p style="padding-left: 5px;"><span style="font-size: 16px; font-family: 等线, sans-serif; padding: 3px 4px; border-radius: 3px; background: #fffaf7; border: 1px solid #efa040; color: #e08910;">武学助手</span> 最普适的选择，推荐 9232 / 19285 加速，支持 206 / 9232 / 19285 加速。支持 4 档延迟。因长按连放延迟问题，推荐选高一档延迟。</p>
<p style="padding-left: 5px;"><span style="font-size: 16px; font-family: 等线, sans-serif; padding: 3px 20px; border-radius: 3px; background: #f7f2fa; border: 1px solid #d1c2e9; color: #78429c;">连令</span> 常规连缘流派，推荐 9232 / 19285 加速，支持 206 / 9232 / 19285 加速。支持 4 档延迟。</p>
<p style="padding-left: 5px;"><span style="font-size: 16px; font-family: 等线, sans-serif; padding: 3px 20px; border-radius: 3px; background: #f2fbf8; border: 1px solid #d0eeda; color: rgba(40, 127, 65);">悸心</span> 手动简易流派，推荐 9232 加速，支持 206 / 9232 / 19285 加速。支持 4 档延迟。</p>
<p style="padding-left: 5px;"><span style="font-size: 16px; font-family: 等线, sans-serif; padding: 3px 20px; border-radius: 3px; background: #f2f7fb; border: 1px solid #c0d8ea; color: #3b75a5;">降厄</span> 进阶流派，推荐 21131 加速，支持 9232 / 21131 加速。支持 3 档延迟。</p>
<h3>无界端</h3>
<p style="padding-left: 5px;">暂不支持。但属性收益与旗舰端相差无几，配装参考旗舰端即可。</p>
<p>&nbsp;</p>
</div>
<h1>三、详细参考</h1>
<h2>1. 样式与标签</h2>
<div class="auto-padding">
<p>为方便参考，我尝试了新的卡片样式排版，以快速识别装备阶级。</p>
<div class="cards-container">
<div class="cards">
<div class="card card-gold">
<div><img class="e-jx3-icon" src="https://icon.jx3box.com/icon/23411.png" alt="23411" /><span style="font-size: 20px;"><strong>夯</strong></span>&nbsp;<span style="color: #aaa;">(品级?)</span></div>
<p><span class="tag tag-gold">属性标签</span></p>
<p>通常是该部件的最优装备</p>
<p>对比其他装备有较大优势</p>
</div>
<div class="card card-purple" style="width: 200px;">
<div><img class="e-jx3-icon" src="https://icon.jx3box.com/icon/12487.png" alt="12487" /><span style="font-size: 20px;"><strong>人上人</strong></span>&nbsp;<span style="color: #aaa;">(部位?)</span></div>
<p><span class="tag tag-purple">属性标签</span></p>
<p>较好的几件，仅次于最优的</p>
<p>没有描述</p>
</div>
<div class="card card-blue" style="width: 200px;">
<div><img class="e-jx3-icon" src="https://icon.jx3box.com/icon/24196.png" /><span style="font-size: 20px;"><strong>NPC</strong></span>&nbsp;<span style="color: #aaa;">(备注?)</span></div>
<p><span class="tag tag-blue">属性标签</span></p>
<p>可选，但提升空间较大</p>
<p>没有描述和图标</p>
</div>
<div class="card card-gray" style="width: 200px;">
<div><img class="e-jx3-icon" src="https://icon.jx3box.com/icon/3321.png" /><span style="font-size: 20px;"><strong>拉</strong></span></div>
<p><span class="tag" style="background: #777;">属性标签</span></p>
<p>... <span style="color: #999;">(注意: 大葱不拉)</span></p>
<p>没在下面见到的属于本栏</p>
</div>
</div>
</div>
<p><strong>属性标签</strong></p>
<p><span class="tag tag-gold">会效</span><span class="tag tag-yellow">会心</span><span class="tag">无双</span><span class="tag tag-red">破防</span><span class="tag tag-green">破招</span><span class="tag tag-purple">急速</span><span class="tag tag-red-blue">内攻</span></p>
</div>
<h2>2. 装备选择</h2>
<div class="auto-padding">
<p>无修推荐将综合性价比考虑，而非单纯以DPS提升为指向，但通常第一件为具备绝对优势的BIS。如无出现，则不推荐。</p>
<p>如无特别声明，以下推荐基于实战满桌药酒 +&nbsp;<strong>4T5N</strong><sup>100层</sup>&nbsp;与木桩环境双重考量。</p>
<p>需要注意，本栏均<span class="highlight">以最终满配毕业为基准</span>参考，如你毕业目标与此不一致，很有<span class="highlight highlight-gold">可能会陷入局部最优解误区</span>。建议自行使用计算器查看。</p>
<p><span class="tooltip tooltip-top" style="padding: 2px 3px; background: #fcfcfc; border-radius: 8px; border: 1px dashed #ddd;">如装备边框有虚线，则代表有部分适用情况，鼠标移上去可以看见描述。<span class="tooltip-text" style="border: 1px dashed #ddd; background: white;">恭喜你，已经学会如何看描述了。</span></span></p>
<hr />
<h3>武器</h3>
<div class="cards-container">
<div class="card card-gold">
<div style="display: flex;">
<div><img class="e-jx3-icon" src="https://icon.jx3box.com/icon/23411.png" alt="23411" /></div>
<div><span style="font-size: 20px;"><strong>蜕骨</strong></span><span style="color: #aaa;"> (29700)</span></div>
</div>
<p><span class="tag tag-yellow">会心</span><span class="tag tag-red">破防</span><span class="tag tag-purple">急速</span></p>
<p>尊贵的<span class="highlight highlight-gold">大橙武</span></p>
<p>即使不考虑橙武特效，单看属性容量也已经赢太多了</p>
</div>
<div class="cards">
<div class="card card-purple">
<div><img class="e-jx3-icon" src="https://icon.jx3box.com/icon/25556.png" /><span style="font-size: 20px;"><strong>荒林暮鸦</strong></span></div>
<p><span class="tag tag-red">破防</span><span class="tag">无双</span> <span style="color: #ccc;">|</span> <span class="tag tag-number">100.00%</span></p>
<p style="text-align: right;"><span style="color: #aaa;">35300 水特效</span></p>
</div>
<div class="tooltip tooltip-top">
<div class="card card-purple" style="border: 2px dashed rgba(232, 216, 252, 0.8);">
<div><img class="e-jx3-icon" src="https://icon.jx3box.com/icon/12487.png" /><span style="font-size: 20px;"><strong>蝎心忘情</strong></span></div>
<p><span class="tag tag-pink-gold">特效</span> <span style="color: #ccc;">|</span> <span class="tag tag-number">97.5%~103.5%</span></p>
<p style="text-align: right;"><span style="color: #aaa;">30700 门派特效</span></p>
</div>
<span class="tooltip-text" style="width: 200px; border: 2px dashed rgba(232, 216, 252, 0.8);">配合易伤有奇效。<br />高收益需要环境支持，理论上限需要使用无支祁。</span></div>
<div class="card card-purple">
<div><img class="e-jx3-icon" src="https://icon.jx3box.com/icon/25557.png" /><span style="font-size: 20px;"><strong>近重渊</strong></span></div>
<p><span class="tag tag-yellow">会心</span><span class="tag">无双</span> <span style="color: #ccc;">|</span> <span class="tag tag-number">97.40%</span></p>
<p style="text-align: right;"><span style="color: #aaa;">35900 切糕</span></p>
</div>
</div>
<div class="cards">
<div class="card card-blue" style="width: 200px;">
<div><img class="e-jx3-icon" src="https://icon.jx3box.com/icon/25556.png" /><span style="font-size: 20px;"><strong>峻茂笛</strong></span></div>
<p><span class="tag tag-yellow">会心</span><span class="tag">无双</span> <span style="color: #ccc;">|</span> <span class="tag tag-number">96.85%</span></p>
<p style="text-align: right;"><span style="color: #aaa;">35300 会无</span></p>
</div>
<div class="card card-blue" style="width: 200px;">
<div><img class="e-jx3-icon" src="https://icon.jx3box.com/icon/25556.png" /><span style="font-size: 20px;"><strong>蛛心笛</strong></span></div>
<p><span class="tag tag-green">破招</span><span class="tag">无双</span> <span style="color: #ccc;">|</span> <span class="tag tag-number">96.02%</span></p>
<p style="text-align: right;"><span style="color: #aaa;">35300 招无</span></p>
</div>
<div class="card card-blue" style="width: 200px;">
<div><img class="e-jx3-icon" src="https://icon.jx3box.com/icon/24196.png" /><span style="font-size: 20px;"><strong>渡飞花</strong></span></div>
<p><span class="tag tag-red">破防</span><span class="tag">无双</span> <span style="color: #ccc;">|</span> <span class="tag tag-number">95.39%</span></p>
<p style="text-align: right;"><span style="color: #aaa;">30200 水特效</span></p>
</div>
</div>
</div>
<hr />
<h3>裤子 &amp; 腰带</h3>
<p style="color: #777;">裤子的属性容量过高，同时部分装备模型的属性分配也有明显倾向，导致了必须同时选择两件互补装备才能获得较好收益。</p>
<p style="color: #777;">在推荐里它们以绑定形式出现，需要同时拥有才能得到较高收益。</p>
<div class="cards-container">
<div class="cards">
<div class="card card-gold" style="border: 1px solid #ffaa00a0;">
<div class="card">
<div><img class="e-jx3-icon" src="https://icon.jx3box.com/icon/25254.png" /><span class="golden-name"><strong>闲来步屧</strong></span></div>
<p><span class="tag tag-yellow">会心</span><span class="tag">无双</span></p>
<p>指定搭配 <span class="highlight">天风断</span></p>
<p>提供巨额会心</p>
</div>
<div class="card" style="margin-top: 10px;">
<div><img class="e-jx3-icon" src="https://icon.jx3box.com/icon/25256.png" /><span class="golden-name"><strong>天风断</strong></span></div>
<p><span class="tag tag-red">破防</span><span class="tag">无双</span></p>
<p>指定搭配 <span class="highlight">闲来步屧</span></p>
<p>补全高额破防</p>
</div>
</div>
<div class="card card-gold" style="border: 1px solid #ffaa00a0;">
<div class="card">
<div><img class="e-jx3-icon" src="https://icon.jx3box.com/icon/25254.png" /><span class="golden-name">吊湘累</span></div>
<p><span class="tag tag-red">破防</span><span class="tag">无双</span></p>
<p>指定搭配 <span class="highlight">秦关易水</span></p>
<p>提供巨额破防</p>
</div>
<div class="card" style="margin-top: 10px;">
<div><img class="e-jx3-icon" src="https://icon.jx3box.com/icon/25256.png" /><span class="golden-name"><strong>秦关易水</strong></span></div>
<p><span class="tag tag-yellow">会心</span><span class="tag">无双</span></p>
<p>指定搭配 <span class="highlight">吊湘累</span></p>
<p>补全高额会心</p>
</div>
</div>
<div class="cards" style="display: flex; flex-direction: column;"><!-- 五属性-->
<div class="card card-gold" style="margin-top: 10px;">
<div><img class="e-jx3-icon" src="https://icon.jx3box.com/icon/25254.png" /><span class="golden-name"><strong>枯梢瘦骨</strong></span></div>
<p><span class="tag tag-yellow">会心</span><span class="tag tag-red">破防</span><span class="tag tag-green">破招</span><span class="tag">无双</span></p>
<p>夸张的容量</p>
<p>均衡之选</p>
</div>
<div class="card card-gold">
<div><img class="e-jx3-icon" src="https://icon.jx3box.com/icon/25256.png" /><span class="golden-name"><strong>独对青山</strong></span></div>
<p><span class="tag tag-yellow">会心</span><span class="tag tag-red">破防</span><span class="tag tag-green">破招</span><span class="tag">无双</span></p>
<p>夸张的容量</p>
<p>补属性很合适</p>
</div>
</div>
</div>
<div style="height: 0px; border-top: 0.5px solid #efefef;">&nbsp;</div>
<div class="cards">
<div class="card card-purple">
<div><img class="e-jx3-icon" src="https://icon.jx3box.com/icon/25254.png" /><span class="common-name"><strong>雁回裤&middot;觉</strong></span></div>
<p><span class="tag tag-yellow">会心</span><span class="tag tag-red">破防</span><span class="tag">无双</span></p>
</div>
<div class="card card-purple">
<div><img class="e-jx3-icon" src="https://icon.jx3box.com/icon/25254.png" /><span class="golden-name"><strong>故垒颓垣</strong></span></div>
<p><span class="tag tag-red-blue">内攻</span><span class="tag tag-yellow">会心</span></p>
</div>
<div class="card card-purple">
<div><img class="e-jx3-icon" src="https://icon.jx3box.com/icon/25254.png" /><span class="golden-name"><strong>风前柳色</strong></span></div>
<p><span class="tag tag-red-blue">内攻</span><span class="tag tag-red">破防</span></p>
</div>
<div class="card card-purple">
<div><img class="e-jx3-icon" src="https://icon.jx3box.com/icon/25254.png" /><span class="common-name"><strong>凤箫裤&middot;破</strong></span></div>
<p><span class="tag tag-red">破防</span><span class="tag">无双</span></p>
</div>
</div>
<div class="cards"><!-- 桃水-->
<div class="card card-purple">
<div><img class="e-jx3-icon" src="https://icon.jx3box.com/icon/25256.png" /><span class="common-name">不群腰带&middot;觉</span></div>
<p><span class="tag tag-yellow">会心</span><span class="tag tag-red">破防</span><span class="tag">无双</span></p>
</div>
<!-- 速无黄字-->
<div class="tooltip tooltip-top">
<div class="card card-purple" style="border: 2px dashed rgba(232, 216, 252, 0.8);">
<div><img class="e-jx3-icon" src="https://icon.jx3box.com/icon/25256.png" /><span class="golden-name">风吹柳絮</span></div>
<p><span class="tag tag-purple">急速</span><span class="tag">无双</span></p>
</div>
<span class="tooltip-text" style="width: 200px; border: 2px dashed rgba(232, 216, 252, 0.8);">仅在需要加速时使用。</span></div>
<div class="card card-purple">
<div><img class="e-jx3-icon" src="https://icon.jx3box.com/icon/25256.png" /><span class="common-name">幽昧腰带&middot;破</span></div>
<p><span class="tag tag-red">破防</span><span class="tag">无双</span></p>
</div>
<div class="card card-purple">
<div><img class="e-jx3-icon" src="https://icon.jx3box.com/icon/25256.png" /><span class="golden-name">明月高楼</span></div>
<p><span class="tag tag-red-blue">内攻</span><span class="tag tag-yellow">会心</span></p>
</div>
</div>
<div style="height: 0px; border-top: 0.5px solid #efefef;">&nbsp;</div>
<div class="cards">
<div class="card card-blue">
<div><span class="common-name">纤云裤&middot;悟</span></div>
<p><span class="tag tag-yellow">会心</span><span class="tag">无双</span></p>
</div>
<div class="card card-blue">
<div><span class="common-name">罗幕裤&middot;尊</span></div>
<p><span class="tag tag-red-blue">内攻</span><span class="tag">无双</span></p>
</div>
<div class="card card-blue">
<div><span class="common-name">寒枝裤&middot;绝</span></div>
<p><span class="tag tag-red">破防</span><span class="tag tag-green">破招</span><span class="tag">无双</span></p>
</div>
<div class="card card-blue">
<div><span class="common-name">清宵裤&middot;明</span></div>
<p><span class="tag tag-yellow">会心</span><span class="tag tag-green">破招</span><span class="tag">无双</span></p>
</div>
</div>
<div class="cards">
<div class="card card-blue">
<div><span class="common-name">迟暮腰带&middot;悟</span></div>
<p><span class="tag tag-yellow">会心</span><span class="tag">无双</span></p>
</div>
<div class="card card-blue">
<div><span class="golden-name">云外孤飞</span> <span style="color: #aaa;">(腰带)</span></div>
<p><span class="tag tag-red-blue">内攻</span><span class="tag tag-red">破防</span></p>
</div>
<div class="card card-blue">
<div><span class="common-name">白露腰带&middot;尊</span></div>
<p><span class="tag tag-red-blue">内攻</span><span class="tag">无双</span></p>
</div>
<div class="card card-blue">
<div><span class="common-name">长佩腰带&middot;绝</span></div>
<p><span class="tag tag-red">破防</span><span class="tag tag-green">破招</span><span class="tag">无双</span></p>
</div>
<div class="card card-blue">
<div><span class="common-name">兰皋腰带&middot;明</span></div>
<p><span class="tag tag-yellow">会心</span><span class="tag tag-green">破招</span><span class="tag">无双</span></p>
</div>
</div>
</div>
<hr />
<h3>戒指</h3>
<div class="cards-container">
<div class="card card-gold">
<div><img class="e-jx3-icon" src="https://icon.jx3box.com/icon/24367.png" /><span class="golden-name">云连海国</span></div>
<p><span class="tag tag-gold">会效</span><span class="tag tag-yellow">会心</span><span class="tag">无双</span></p>
<p>具备绝对优势的<span class="highlight highlight-gold">BIS</span></p>
<p>不必犹豫，直接拿下</p>
</div>
<div class="cards">
<div class="card card-purple">
<div><img class="e-jx3-icon" src="https://icon.jx3box.com/icon/22893.png" /><span class="golden-name">出昆仑</span></div>
<p><span class="tag tag-gold">会效</span><span class="tag tag-yellow">会心</span><span class="tag tag-green">破招</span></p>
</div>
<div class="card card-purple">
<div><img class="e-jx3-icon" src="https://icon.jx3box.com/icon/2855.png" /><span class="golden-name">烟柳萧疏</span></div>
<p><span class="tag tag-yellow">会心</span><span class="tag tag-red">破防</span><span class="tag tag-green">破招</span><span class="tag">无双</span></p>
</div>
<div class="card card-purple">
<div><img class="e-jx3-icon" src="https://icon.jx3box.com/icon/2851.png" /><span class="golden-name">频怅望</span></div>
<p><span class="tag tag-red">破防</span><span class="tag">无双</span></p>
</div>
<div class="tooltip tooltip-top">
<div class="card card-purple" style="border: 2px dashed rgba(232, 216, 252, 0.8);">
<div><img class="e-jx3-icon" src="https://icon.jx3box.com/icon/2847.png" /><span class="golden-name">戎马略</span></div>
<p><span class="tag tag-yellow">会心</span><span class="tag">无双</span></p>
</div>
<span class="tooltip-text" style="width: 200px; border: 2px dashed rgba(232, 216, 252, 0.8);">仅适用于会心不超过<span class="tag tag-number">70%</span>的情况。</span></div>
</div>
<div class="cards">
<div class="card card-blue">
<div><span class="common-name">汀洲戒&middot;觉</span></div>
<p><span class="tag tag-yellow">会心</span><span class="tag tag-red">破防</span><span class="tag">无双</span></p>
</div>
<div class="card card-blue">
<div><span class="common-name">琼楼戒&middot;破</span></div>
<p><span class="tag tag-red">破防</span><span class="tag">无双</span></p>
</div>
<div class="card card-blue">
<div><span class="common-name">萧瑟戒&middot;悟</span></div>
<p><span class="tag tag-yellow">会心</span><span class="tag">无双</span></p>
</div>
<div class="card card-blue">
<div><span class="common-name">轩窗戒&middot;尊</span></div>
<p><span class="tag tag-red-blue">内攻</span><span class="tag">无双</span></p>
</div>
<div class="card card-blue">
<div><span class="golden-name">如龙势</span> <span style="color: #aaa;">(30200)</span></div>
<p><span class="tag tag-gold">会效</span><span class="tag tag-yellow">会心</span><span class="tag">无双</span></p>
</div>
</div>
</div>
<hr />
<h3>护手</h3>
<div class="cards-container">
<div class="card card-gold">
<div><img class="e-jx3-icon" src="https://icon.jx3box.com/icon/25252.png" /><span class="golden-name">九重霄汉</span></div>
<p><span class="tag tag-gold">会效</span><span class="tag tag-yellow">会心</span><span class="tag">无双</span></p>
<p>具备绝对优势的<span class="highlight highlight-gold">BIS</span></p>
<p>不必犹豫，直接拿下</p>
</div>
<div class="cards">
<div class="card card-purple">
<div><img class="e-jx3-icon" src="https://icon.jx3box.com/icon/25252.png" /><span class="golden-name">云收雾敛</span></div>
<p><span class="tag tag-gold">会效</span><span class="tag tag-yellow">会心</span><span class="tag tag-green">破招</span></p>
</div>
<div class="tooltip tooltip-top">
<div class="card card-purple" style="border: 2px dashed rgba(232, 216, 252, 0.8);">
<div><img class="e-jx3-icon" src="https://icon.jx3box.com/icon/25252.png" /><span class="golden-name">一枕清宵</span></div>
<p><span class="tag tag-purple">急速</span><span class="tag">无双</span></p>
</div>
<span class="tooltip-text" style="width: 200px; border: 2px dashed rgba(232, 216, 252, 0.8);">仅在需要加速时使用。</span></div>
<div class="card card-purple">
<div><img class="e-jx3-icon" src="https://icon.jx3box.com/icon/25252.png" /><span class="golden-name">紫凤衔花</span></div>
<p><span class="tag tag-red">破防</span><span class="tag">无双</span></p>
</div>
<div class="tooltip tooltip-top">
<div class="card card-purple" style="border: 2px dashed rgba(232, 216, 252, 0.8);">
<div><img class="e-jx3-icon" src="https://icon.jx3box.com/icon/25252.png" /><span class="golden-name">露香尘</span></div>
<p><span class="tag tag-yellow">会心</span><span class="tag">无双</span></p>
</div>
<span class="tooltip-text" style="width: 200px; border: 2px dashed rgba(232, 216, 252, 0.8);">仅适用于会心不超过<span class="tag tag-number">70%</span>的情况。</span></div>
</div>
<div class="cards">
<div class="tooltip tooltip-top">
<div class="card card-blue" style="border: 2px dashed rgba(128, 205, 248, 0.45);">
<div><span class="common-name">池鱼袖&middot;迅</span></div>
<p><span class="tag tag-purple">急速</span><span class="tag">无双</span></p>
</div>
<span class="tooltip-text" style="width: 200px; border: 2px dashed rgba(128, 205, 248, 0.45);">仅在需要加速时使用。</span></div>
<div class="card card-blue">
<div><span class="common-name">新雨袖&middot;觉</span></div>
<p><span class="tag tag-yellow">会心</span><span class="tag tag-red">破防</span><span class="tag">无双</span></p>
</div>
<div class="card card-blue">
<div><span class="common-name">渚清袖&middot;破</span></div>
<p><span class="tag tag-red">破防</span><span class="tag">无双</span></p>
</div>
<div class="card card-blue">
<div><span class="common-name">渚清袖&middot;破</span></div>
<p><span class="tag tag-yellow">会心</span><span class="tag">无双</span></p>
</div>
</div>
</div>
<hr />
<p style="padding: 30px 0; font-size: 18px; text-shadow: 0 0 1px rgba(0,0,0,0.2);">以下大部分为无修相关推荐，所有列出装备均好于同部位散件。</p>
<hr />
<h3>暗器</h3>
<div class="cards">
<div class="card card-gold">
<div><img class="e-jx3-icon" src="https://icon.jx3box.com/icon/801.png" alt="801" /><span style="font-size: 20px;"><strong>无修囊</strong></span> <span style="color: #aaa;">(35300)</span></div>
<p><span class="tag tag-yellow">会心</span><span class="tag">无双</span></p>
</div>
<div class="card card-gold">
<div><img class="e-jx3-icon" src="https://icon.jx3box.com/icon/801.png" alt="801" /><span style="font-size: 20px;"><strong>无修囊</strong></span> <span style="color: #aaa;">(35300)</span></div>
<p><span class="tag tag-yellow">会心</span><span class="tag tag-red">破防</span><span class="tag">无双</span></p>
</div>
</div>
<p style="padding: 5px 0; color: #888;">视乎不同配装有微弱差距，选哪个都可以。</p>
<div style="padding: 5px 0; height: 0px; border-top: 0.5px solid #efefef; max-width: 960px;">&nbsp;</div>
<div class="cards">
<div class="card card-purple">
<div><img class="e-jx3-icon" src="https://icon.jx3box.com/icon/801.png" alt="801" /><span style="font-size: 20px;"><strong>无修囊</strong></span> <span style="color: #aaa;">(32500)</span></div>
<p><span class="tag tag-gold">会效</span><span class="tag tag-yellow">会心</span><span class="tag">无双</span></p>
</div>
<div class="card card-purple">
<div><img class="e-jx3-icon" src="https://icon.jx3box.com/icon/801.png" alt="801" /><span style="font-size: 20px;"><strong>无修囊</strong></span> <span style="color: #aaa;">(32500)</span></div>
<p><span class="tag tag-gold">会效</span><span class="tag tag-yellow">会心</span><span class="tag tag-green">破招</span></p>
</div>
<div class="card card-purple">
<div><img class="e-jx3-icon" src="https://icon.jx3box.com/icon/801.png" alt="801" /><span style="font-size: 20px;"><strong>无修囊</strong></span> <span style="color: #aaa;">(35300)</span></div>
<p><span class="tag tag-red">破防</span><span class="tag tag-green">破招</span><span class="tag">无双</span></p>
</div>
</div>
<p style="padding: 5px 0; color: #888;">325会会无是性价比优选。如果是有挑战附魔的302会会无可以直接等满品。</p>
<hr />
<h3>帽子</h3>
<div class="cards">
<div class="card card-gold">
<div><img class="e-jx3-icon" src="https://icon.jx3box.com/icon/9240.png" /><span style="font-size: 20px;"><strong>无修冠</strong></span> <span style="color: #aaa;">(35300)</span></div>
<p><span class="tag tag-yellow">会心</span><span class="tag">无双</span></p>
</div>
<div class="card card-gold">
<div><img class="e-jx3-icon" src="https://icon.jx3box.com/icon/9240.png" /><span style="font-size: 20px;"><strong>无修冠</strong></span> <span style="color: #aaa;">(35300)</span></div>
<p><span class="tag tag-yellow">会心</span><span class="tag tag-red">破防</span><span class="tag">无双</span></p>
</div>
</div>
<p style="padding: 5px 0; color: #888;">视乎不同配装有微弱差距，选哪个都可以。一般来说会无好一点。</p>
<div style="padding: 5px 0; height: 0px; border-top: 0.5px solid #efefef; max-width: 960px;">&nbsp;</div>
<div class="cards">
<div class="card card-purple">
<div><img class="e-jx3-icon" src="https://icon.jx3box.com/icon/9240.png" /><span style="font-size: 20px;"><strong>无修冠</strong></span> <span style="color: #aaa;">(35300)</span></div>
<p><span class="tag tag-yellow">会心</span><span class="tag tag-green">破招</span><span class="tag">无双</span></p>
</div>
<div class="card card-purple">
<div><img class="e-jx3-icon" src="https://icon.jx3box.com/icon/9240.png" /><span style="font-size: 20px;"><strong>无修冠</strong></span> <span style="color: #aaa;">(32500)</span></div>
<p><span class="tag tag-yellow">会心</span><span class="tag">无双</span></p>
</div>
<div class="card card-purple">
<div><img class="e-jx3-icon" src="https://icon.jx3box.com/icon/9240.png" /><span style="font-size: 20px;"><strong>无修冠</strong></span> <span style="color: #aaa;">(32500)</span></div>
<p><span class="tag tag-yellow">会心</span><span class="tag tag-red">破防</span><span class="tag">无双</span></p>
</div>
<div class="card card-purple">
<div><img class="e-jx3-icon" src="https://icon.jx3box.com/icon/9240.png" /><span style="font-size: 20px;"><strong>无修冠</strong></span> <span style="color: #aaa;">(30200)</span></div>
<p><span class="tag tag-gold">会效</span><span class="tag tag-yellow">会心</span><span class="tag">无双</span></p>
</div>
</div>
<p style="padding: 5px 0; color: #888;">其他不建议使用。</p>
<hr />
<h3>鞋子</h3>
<div class="cards">
<div class="card card-gold">
<div><img class="e-jx3-icon" src="https://icon.jx3box.com/icon/9245.png" /><span style="font-size: 20px;"><strong>无修鞋</strong></span> <span style="color: #aaa;">(35300)</span></div>
<p><span class="tag tag-gold">会效</span><span class="tag tag-yellow">会心</span><span class="tag">无双</span></p>
</div>
<div class="card card-purple">
<div><img class="e-jx3-icon" src="https://icon.jx3box.com/icon/9245.png" /><span style="font-size: 20px;"><strong>无修鞋</strong></span> <span style="color: #aaa;">(35300)</span></div>
<p><span class="tag tag-red">破防</span><span class="tag">无双</span></p>
</div>
</div>
<p style="padding: 5px 0; color: #888;">其他不建议使用，不如随便等个过得去的腰带。</p>
<hr />
<h3>项链</h3>
<div class="cards-container">
<div class="cards">
<div class="card card-gold">
<div><img class="e-jx3-icon" src="https://icon.jx3box.com/icon/2838.png" /><span style="font-size: 20px;"><strong>无修链</strong></span> <span style="color: #aaa;">(35300)</span></div>
<p><span class="tag tag-yellow">会心</span><span class="tag tag-green">破招</span><span class="tag">无双</span></p>
<p>高贵的会效特效</p>
</div>
</div>
<div class="cards">
<div class="card card-purple">
<div><img class="e-jx3-icon" src="https://icon.jx3box.com/icon/2838.png" /><span style="font-size: 20px;"><strong>无修链</strong></span> <span style="color: #aaa;">(35300)</span></div>
<p><span class="tag tag-red">破防</span><span class="tag">无双</span></p>
</div>
<div class="card card-purple">
<div><img class="e-jx3-icon" src="https://icon.jx3box.com/icon/2838.png" /><span style="font-size: 20px;"><strong>无修链</strong></span> <span style="color: #aaa;">(35300)</span></div>
<p><span class="tag tag-red-blue">内攻</span><span class="tag">无双</span></p>
</div>
</div>
<div class="cards">
<div class="card card-blue">
<div><span style="font-size: 20px;"><strong>无修链</strong></span> <span style="color: #aaa;">(32500)</span></div>
<p><span class="tag tag-red">破防</span><span class="tag">无双</span></p>
</div>
<div class="card card-blue">
<div><span style="font-size: 20px;"><strong>无修链</strong></span> <span style="color: #aaa;">(32500)</span></div>
<p><span class="tag tag-yellow">会心</span><span class="tag tag-green">破招</span><span class="tag">无双</span></p>
</div>
</div>
</div>
<hr />
<h3>腰坠</h3>
<div class="cards-container">
<div class="cards">
<div class="card card-gold">
<div><img class="e-jx3-icon" src="https://icon.jx3box.com/icon/22900.png" /><span style="font-size: 20px; color: rgba(240, 160, 40);"><strong>冷韵幽怀</strong></span></div>
<p><span class="tag tag-red">破防</span><span class="tag">无双</span></p>
<p>更适合应对副本易伤</p>
</div>
<div class="card card-gold">
<div><img class="e-jx3-icon" src="https://icon.jx3box.com/icon/1215.png" /><span style="font-size: 20px; color: rgba(240, 160, 40);"><strong>无修坠</strong></span> <span style="color: #aaa;">(32300)</span></div>
<p><span class="tag tag-gold">会效</span><span class="tag tag-yellow">会心</span><span class="tag">无双</span></p>
<p>长轴环境最佳</p>
</div>
</div>
<div class="cards">
<div class="card card-purple">
<div><img class="e-jx3-icon" src="https://icon.jx3box.com/icon/1215.png" /><span style="font-size: 20px; color: rgba(240, 160, 40);"><strong>无修坠</strong></span> <span style="color: #aaa;">(32300)</span></div>
<p><span class="tag tag-yellow">会心</span><span class="tag">无双</span></p>
</div>
<div class="card card-purple">
<div><img class="e-jx3-icon" src="https://icon.jx3box.com/icon/1215.png" /><span style="font-size: 20px; color: rgba(240, 160, 40);"><strong>无修坠</strong></span> <span style="color: #aaa;">(32300)</span></div>
<p><span class="tag tag-yellow">会心</span><span class="tag tag-red">破防</span><span class="tag">无双</span></p>
</div>
<div class="card card-purple">
<div><img class="e-jx3-icon" src="https://icon.jx3box.com/icon/1215.png" /><span style="font-size: 20px;"><strong>无修坠</strong></span> <span style="color: #aaa;">(32500)</span></div>
<p><span class="tag tag-gold">会效</span><span class="tag tag-yellow">会心</span><span class="tag">无双</span></p>
</div>
</div>
</div>
<p style="padding: 5px 0; color: #888;">其他不建议使用，不如精八橙色声望腰坠。</p>
</div>
<h2>3. 五彩石选择</h2>
<div class="auto-padding">
<p>基于属性收益，我们可以很轻巧地得出结论：</p>
<p>选 <span class="tag tag-gold">会效</span> 在第三词条的五彩石，剩下选 <span class="tag">无双</span><span class="tag tag-red">破防</span><span class="tag tag-yellow">会心</span><span class="tag tag-red-blue">内攻</span> 均可。</p>
<p>推荐以下五彩石：</p>
<blockquote>
<p><span class="highlight">灭气&middot;无双&middot;月华 (破防&middot;无双&middot;会效)</span></p>
<p>XX&middot;无双&middot;月华 （任意&middot;无双&middot;会效）</p>
<p>XX&middot;无双&middot;穿石（任意&middot;无双&middot;毒性会效）</p>
<p>星见&middot;激流&middot;月华 （会心&middot;内攻&middot;会效）对 PVE 而言收益较好，还同时适用于PVE、PVP，节省金钱。</p>
</blockquote>
<p>毒经是毒性内功心法，可以使用毒性五彩石。</p>
<p>&nbsp;</p>
</div>
<h2>4. 附魔选择</h2>
<div class="auto-padding">
<p><span class="highlight">优先选择紫色附魔</span>、大部分散件换精简的提升也只有一个小附魔的提升。不要舍小钱花大钱。</p>
<p>基于属性收益和可选内容，我们可以很轻巧地得出结论：</p>
<div class="cards-container">
<div class="cards">
<div class="card" style="width: 180px;">
<div style="text-align: center;"><span style="font-size: 18px; color: #7f30a2;"><strong>戒指、武器</strong></span></div>
<hr />
<div>
<p style="text-align: center; font-size: 20px; text-shadow: 0.5px 1px 1px rgba(0, 0, 0, 0.15);"><span class="tag tag-red-blue">内攻</span></p>
</div>
</div>
<div class="card" style="width: 180px;">
<div style="text-align: center;"><span style="font-size: 18px; color: #7f30a2;"><strong>帽子、鞋子</strong></span></div>
<hr />
<div>
<p style="text-align: center; font-size: 20px; text-shadow: 0.5px 1px 1px rgba(0, 0, 0, 0.15);"><span class="tag tag-red-blue">内攻</span></p>
<p style="text-align: center; font-size: 20px; text-shadow: 0.5px 1px 1px rgba(0, 0, 0, 0.15); padding-bottom: 20px;"><span class="tag tag-purple">急速</span></p>
</div>
</div>
<div class="card" style="width: 180px;">
<div style="text-align: center;"><span style="font-size: 18px; color: #7f30a2;"><strong>护手、裤子</strong></span></div>
<hr />
<div>
<p style="text-align: center; font-size: 20px; text-shadow: 0.5px 1px 1px rgba(0, 0, 0, 0.15);"><span class="tag">无双</span></p>
</div>
</div>
</div>
<div class="cards">
<div class="card" style="width: 180px;">
<div style="text-align: center;"><span style="font-size: 18px; color: #7f30a2;"><strong>暗器</strong></span></div>
<hr />
<div>
<p style="text-align: center; font-size: 20px; text-shadow: 0.5px 1px 1px rgba(0, 0, 0, 0.15);"><span class="tag tag-red">破防</span></p>
<p style="text-align: center; font-size: 20px; text-shadow: 0.5px 1px 1px rgba(0, 0, 0, 0.15); padding-bottom: 20px;"><span class="tag tag-purple">急速</span></p>
</div>
</div>
<div class="card" style="width: 180px;">
<div style="text-align: center;"><span style="font-size: 18px; color: #7f30a2;"><strong>项链、腰坠</strong></span></div>
<hr />
<div>
<p style="text-align: center; font-size: 20px; text-shadow: 0.5px 1px 1px rgba(0, 0, 0, 0.15);"><span class="tag tag-cyan">体质</span></p>
<p style="text-align: center; font-size: 20px; text-shadow: 0.5px 1px 1px rgba(0, 0, 0, 0.15);"><span class="tag tag-pink-gold">挑战附魔</span></p>
</div>
</div>
<div class="card" style="width: 180px;">
<div style="text-align: center;"><span style="font-size: 18px; color: #7f30a2;"><strong>衣服腰带</strong></span></div>
<hr />
<div>
<p style="text-align: center; font-size: 20px; text-shadow: 0.5px 1px 1px rgba(0, 0, 0, 0.15);"><span class="tag">无双</span></p>
<p style="text-align: center; color: #aaa; font-size: 14px;">(节日附魔)</p>
</div>
</div>
</div>
</div>
</div>
<h2>5. 阵眼选择</h2>
<div class="auto-padding">
<div class="cards-container">
<div class="cards" style="align-items: center;">
<div class="card card-gold" style="width: 108px;">
<div style="text-align: center;"><img class="e-jx3-icon" src="https://icon.jx3box.com/icon/3152.png" /><br /><span style="font-size: 20px; color: #4b7128;"><strong>田螺阵</strong></span></div>
</div>
<div style="width: 0px; border: 1px solid #f4f2f3; height: 96px;">
<p>&nbsp;</p>
</div>
<div class="card card-purple" style="width: 108px;">
<div style="text-align: center;"><img class="e-jx3-icon" src="https://icon.jx3box.com/icon/20426.png" /><br /><span style="font-size: 20px; color: #dca53e;"><strong>万灵阵</strong></span></div>
</div>
<div class="card card-purple" style="width: 108px; text-align: center;">
<div><img class="e-jx3-icon" src="https://icon.jx3box.com/icon/2714.png" /></div>
<div><span style="font-size: 20px; color: #7f30a2;"><strong>毒经阵眼</strong></span></div>
</div>
<div style="width: 0px; border: 1px solid #f4f2f3; height: 96px;">
<p>&nbsp;</p>
</div>
<div class="card card-green" style="width: 100px; text-align: center;">
<div><img class="e-jx3-icon" src="https://icon.jx3box.com/icon/22210.png" /></div>
<div><span style="font-size: 16px; color: #454;"><strong>随便什么阵</strong></span></div>
</div>
</div>
</div>
</div>
<h2>6. 小药选择</h2>
<div class="auto-padding">
<p>你可以通过枫影插件的交易行辅助搜索功能，通过属性快速查询你需要的小药。</p>
<div class="cards-container">
<div class="card" style="width: 575px;">
<div style="text-align: center;"><span style="font-size: 20px; color: #7f30a2;"><strong>固定选择</strong></span></div>
<hr />
<div class="auto-padding-2">
<p><img class="e-jx3-icon" style="width: 28px; height: 28px;" src="https://icon.jx3box.com/icon/261.png" /><span class="tag">根骨</span> <a class="e-jx3-item e-jx3-item-q4 w-jx3-element" href="https://www.jx3box.com/item/view/5_71288" target="_blank" rel="noopener" data-client="std" data-quality="4" data-id="5_71288" data-mode="" data-type="item">[风语&middot;咸骨粥]</a></p>
<p><img class="e-jx3-icon" style="width: 28px; height: 28px;" src="https://icon.jx3box.com/icon/4266.png" /><span class="tag">根骨</span> <a class="e-jx3-item e-jx3-item-q4 w-jx3-element" href="https://www.jx3box.com/item/view/5_71262" target="_blank" rel="noopener" data-client="std" data-quality="4" data-id="5_71262" data-mode="" data-type="item">[风语&middot;上品静心丸]</a></p>
<p><img class="e-jx3-icon" style="width: 28px; height: 28px;" src="https://icon.jx3box.com/icon/7596.png" /><span class="tag tag-red-blue">内攻</span> <a class="e-jx3-item e-jx3-item-q4 w-jx3-element" href="https://www.jx3box.com/item/view/5_71130" target="_blank" rel="noopener" data-type="item" data-mode="" data-id="5_71130" data-quality="4" data-client="std">[风语&middot;坠宵熔锭（内攻）]</a></p>
</div>
</div>
<div class="cards">
<div class="card" style="width: 280px;">
<div style="text-align: center;"><span style="font-size: 20px; color: #7f30a2;"><strong>增强类食品</strong></span></div>
<hr />
<div style="padding-left: 25px;">
<p><span style="color: #ffaa00; font-size: 18px;">★</span><img class="e-jx3-icon" style="width: 28px; height: 28px;" src="https://icon.jx3box.com/icon/8909.png" /><span class="tag tag-yellow">会心</span> <a class="e-jx3-item e-jx3-item-q4 w-jx3-element" href="https://www.jx3box.com/item/view/5_71268" target="_blank" rel="noopener" data-type="item" data-mode="" data-id="5_71268" data-quality="4" data-client="std">[风语&middot;酸菜鱼]</a></p>
<p style="padding-left: 15px;"><img class="e-jx3-icon" style="width: 28px; height: 28px;" src="https://icon.jx3box.com/icon/9999.png" /><span class="tag tag-red">破防</span> <a class="e-jx3-item e-jx3-item-q4 w-jx3-element" href="https://www.jx3box.com/item/view/5_71269" target="_blank" rel="noopener" data-type="item" data-mode="" data-id="5_71269" data-quality="4" data-client="std">[风语&middot;红烧排骨]</a></p>
<p style="padding-left: 15px;"><img class="e-jx3-icon" style="width: 28px; height: 28px;" src="https://icon.jx3box.com/icon/7614.png" /><span class="tag tag-red-blue">内攻</span> <a class="e-jx3-item e-jx3-item-q4 w-jx3-element" href="https://www.jx3box.com/item/view/5_71273" target="_blank" rel="noopener" data-type="item" data-mode="" data-id="5_71273" data-quality="4" data-client="std">[风语&middot;灌汤包]</a></p>
</div>
</div>
<div class="card" style="width: 280px;">
<div style="text-align: center;"><span style="font-size: 20px; color: #7f30a2;"><strong>增强类药品</strong></span></div>
<hr />
<div style="padding-left: 15px;">
<p><span style="color: #ffaa00; font-size: 18px;">★</span><img class="e-jx3-icon" style="width: 28px; height: 28px;" src="https://icon.jx3box.com/icon/4268.png" /><span class="tag tag-yellow">会心</span> <a class="e-jx3-item e-jx3-item-q4 w-jx3-element" href="https://www.jx3box.com/item/view/5_71242" target="_blank" rel="noopener" data-type="item" data-mode="" data-id="5_71242" data-quality="4" data-client="std">[风语&middot;上品玉璃散]</a></p>
<p style="padding-left: 15px;"><img class="e-jx3-icon" style="width: 28px; height: 28px;" src="https://icon.jx3box.com/icon/4278.png" /><span class="tag tag-red">破防</span> <a class="e-jx3-item e-jx3-item-q4 w-jx3-element" href="https://www.jx3box.com/item/view/5_71243" target="_blank" rel="noopener" data-type="item" data-mode="" data-id="5_71243" data-quality="4" data-client="std">[风语&middot;上品破秽散]</a></p>
<p style="padding-left: 15px;"><img class="e-jx3-icon" style="width: 28px; height: 28px;" src="https://icon.jx3box.com/icon/1360.png" /><span class="tag tag-red-blue">内攻</span> <a class="e-jx3-item e-jx3-item-q4 w-jx3-element" href="https://www.jx3box.com/item/view/5_71247" target="_blank" rel="noopener" data-type="item" data-mode="" data-id="5_71247" data-quality="4" data-client="std">[风语&middot;上品展凤散]</a></p>
</div>
</div>
</div>
<p style="color: #aaa;">注: 标 <span style="color: #ffaa00; font-size: 18px;">★</span> 为通常选择。你可以在计算器中依照自己的装备选择更优搭配。实际上很多情况需要使用加速小药。</p>
</div>
</div>
<p>&nbsp;</p>
<hr />
<div class="outro" style="text-align: center; font-size: 18px; text-shadow: 0.5px 0.5px 0.5px rgba(0, 0, 0, 0.2); height: 250px; border-radius: 20px; background: linear-gradient(to top, rgba(104, 24, 138, 0.1), rgba(104, 104, 104, 0.03), transparent);">
<p>正文结束</p>
<p>祝大家都能遇到心仪的装备 :)</p>
</div>

`