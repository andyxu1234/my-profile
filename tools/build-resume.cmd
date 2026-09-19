@echo off
rem 一键重跑简历生成器（Windows 双击即可）。
rem 改动 index.html 的文案后运行本文件，重新生成 resume.md / resume-en.md。
setlocal
set "WS=C:\Users\20534\.workbuddy\binaries\node\workspace"
set "NODE=C:\Users\20534\.workbuddy\binaries\node\versions\22.22.2-3\node.exe"
set "NODE_PATH=%WS%\node_modules"
"%NODE%" "C:\andy\codebase\my-profile\tools\build-resume.cjs"
echo.
pause
