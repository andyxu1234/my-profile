# -*- coding: utf-8 -*-
"""把 world-cup-prediction 的 demo 页搬进 my-profile/projects/，并处理资源。

做三件事：
1. 复制 demo.html，重写资源路径（并顺带修掉 lightbox 的 docs/screenshot 坏路径）
2. 只复制真正被引用的 aimodels SVG
3. 截图按最大宽度/高度缩放并重新压缩，控制总体积
"""
import os
import re
import shutil
import sys

SRC = r"C:\andy\codebase\world-cup-prediction"
DOCS = os.path.join(SRC, "docs")
DEMO = os.path.join(DOCS, "demo.html")
AIMODELS_SRC = os.path.join(SRC, "client", "src", "assets", "aimodels")
SHOTS_SRC = os.path.join(DOCS, "screenshot")

DST = r"C:\andy\codebase\my-profile\projects"
SHOTS_DST = os.path.join(DST, "screenshot")
AIMODELS_DST = os.path.join(DST, "aimodels")

MAX_W = 720
MAX_H = 2600
QUALITY = 82
SIZE_THRESHOLD = 260 * 1024  # 小于该体积的图不再压，避免画质损失

from PIL import Image

os.makedirs(SHOTS_DST, exist_ok=True)
os.makedirs(AIMODELS_DST, exist_ok=True)

html = open(DEMO, encoding="utf-8").read()

# ---- 1. 路径重写 ----------------------------------------------------------
# lightbox 的坏路径先修（它比 img src 多一层 docs/）
html = html.replace("openLightbox('docs/screenshot/", "openLightbox('screenshot/")
# aimodels 从仓库内相对路径改为同目录
html = html.replace("../client/src/assets/aimodels/", "aimodels/")

out_html = os.path.join(DST, "world-cup-prediction.html")
open(out_html, "w", encoding="utf-8").write(html)
print(f"[html] {len(html)/1024:.0f} KB -> {out_html}")

# 校验：不应再残留旧路径
leftover = [p for p in ("../client/", "docs/screenshot/", "docs/docs/") if p in html]
print(f"[html] 残留旧路径检查: {'OK 无残留' if not leftover else '仍有 -> ' + str(leftover)}")

# ---- 2. 只复制被引用的 SVG -------------------------------------------------
refs = set(re.findall(r'aimodels/([A-Za-z0-9_\-]+\.svg)', html))
copied, missing = [], []
for name in sorted(refs):
    s = os.path.join(AIMODELS_SRC, name)
    if os.path.exists(s):
        shutil.copy2(s, os.path.join(AIMODELS_DST, name))
        copied.append(name)
    else:
        missing.append(name)
print(f"[svg ] 引用 {len(refs)} 个，复制 {len(copied)} 个" + (f"，缺失 {missing}" if missing else ""))
print(f"[svg ] {', '.join(copied)}")

# ---- 3. 截图压缩 ----------------------------------------------------------
shots = sorted(set(re.findall(r'screenshot/([^"\')]+\.jpg)', html)))
print(f"\n[img ] 引用 {len(shots)} 张")
tot_before = tot_after = 0
rows = []
for name in shots:
    s = os.path.join(SHOTS_SRC, name)
    d = os.path.join(SHOTS_DST, name)
    if not os.path.exists(s):
        rows.append((name, "-", "-", "缺失"))
        continue
    b = os.path.getsize(s)
    im = Image.open(s)
    w0, h0 = im.size
    scale = min(1.0, MAX_W / w0, MAX_H / h0)
    if scale < 1.0:
        im = im.resize((max(1, int(w0 * scale)), max(1, int(h0 * scale))), Image.LANCZOS)
    if im.mode not in ("RGB", "L"):
        im = im.convert("RGB")
    if b <= SIZE_THRESHOLD and scale >= 1.0:
        shutil.copy2(s, d)
    else:
        im.save(d, "JPEG", quality=QUALITY, optimize=True, progressive=True)
    a = os.path.getsize(d)
    tot_before += b
    tot_after += a
    rows.append((name, f"{w0}x{h0}", f"{b/1024:.0f}K -> {a/1024:.0f}K", f"-{100*(b-a)/b:.0f}%"))

for r in rows:
    print(f"  {r[0]:<24} {r[1]:<12} {r[2]:<20} {r[3]}")
print(f"\n[img ] 合计 {tot_before/1024/1024:.1f} MB -> {tot_after/1024/1024:.1f} MB "
      f"(压缩率 {100*(tot_before-tot_after)/tot_before:.0f}%)")

# ---- 4. 汇总 --------------------------------------------------------------
def tree_size(p):
    t = 0
    for root, _, files in os.walk(p):
        for f in files:
            t += os.path.getsize(os.path.join(root, f))
    return t

print(f"\n[all ] projects/ 总体积: {tree_size(DST)/1024/1024:.2f} MB")
