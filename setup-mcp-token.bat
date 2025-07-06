@echo off
echo Setting up GitHub Personal Access Token for MCP...
echo.
echo Please follow these steps:
echo 1. Go to https://github.com/settings/tokens
echo 2. Click "Generate new token (classic)"
echo 3. Give it a descriptive name like "MCP Claude Integration"
echo 4. Select these scopes:
echo    - repo (all)
echo    - read:org
echo    - read:user
echo 5. Click "Generate token"
echo 6. Copy the token (starts with ghp_)
echo.
set /p token="Paste your GitHub token here: "
echo.

REM Set as user environment variable
setx GITHUB_PAT "%token%"

echo.
echo Token has been saved as GITHUB_PAT environment variable.
echo.
echo IMPORTANT SECURITY STEPS:
echo 1. Delete the old token from GitHub immediately!
echo    Go to: https://github.com/settings/tokens
echo    Find the token ending with "0Q63nt" and delete it
echo.
echo 2. Restart Claude Desktop for changes to take effect
echo.
pause