@echo off
echo ========================================
echo  Fixing chatbot submodule issue
echo ========================================

cd D:\ML_AI\LLM\portfolio

echo.
echo [Step 1] Removing .gitmodules file...
if exist .gitmodules (
    git rm --cached .gitmodules 2>nul
    del /f .gitmodules
    echo  .gitmodules deleted
) else (
    echo  .gitmodules not found - skipping
)

echo.
echo [Step 2] Removing chatbot from git cache...
git rm -r --cached chatbot 2>nul
echo  Done

echo.
echo [Step 3] Removing submodule config from .git/config...
git config --remove-section submodule.chatbot 2>nul
echo  Done

echo.
echo [Step 4] Checking .gitignore for chatbot...
findstr /n "chatbot" .gitignore
if %errorlevel% neq 0 (
    echo chatbot/ >> .gitignore
    echo  Added chatbot/ to .gitignore
) else (
    echo  chatbot/ already in .gitignore
)

echo.
echo [Step 5] Staging all changes...
git add .

echo.
echo [Step 6] Current git status:
git status

echo.
echo [Step 7] Committing...
git commit -m "fully remove chatbot submodule and .gitmodules"

echo.
echo [Step 8] Force pushing...
git push --force

echo.
echo ========================================
echo  Done! Check GitHub Actions now.
echo ========================================

pause
