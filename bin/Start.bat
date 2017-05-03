@echo off
node %~dp0\..\src\windows-service\service.js
ping 127.0.0.1 -n 2 >NUL 2>&1
