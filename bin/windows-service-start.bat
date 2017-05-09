@echo off
node %~dp0\..\src\services\windows\service-start.js
ping 127.0.0.1 -n 2 >NUL 2>&1
