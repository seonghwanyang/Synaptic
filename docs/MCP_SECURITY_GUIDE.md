# MCP Security Configuration Guide

## ⚠️ URGENT: Security Issue Detected

Your GitHub Personal Access Token was exposed in the MCP configuration file. Please follow these steps immediately:

## 🔴 Step 1: Revoke the Exposed Token

1. Go to https://github.com/settings/tokens
2. Find the token ending with `0Q63nt`
3. Click "Delete" to revoke it immediately
4. This prevents anyone from using the exposed token

## 🟢 Step 2: Create a New Token

1. Click "Generate new token (classic)"
2. Name it: "MCP Claude Integration"
3. Set expiration (recommended: 90 days)
4. Select scopes:
   - `repo` (Full control of private repositories)
   - `read:org` (Read org and team membership)
   - `read:user` (Read user profile data)
5. Click "Generate token"
6. Copy the new token (starts with `ghp_`)

## 🔵 Step 3: Set Up Secure Configuration

### Option A: Using the Batch Script (Windows)
```bash
# Run the setup script
setup-mcp-token.bat
```

### Option B: Manual Setup
1. Set environment variable:
   ```cmd
   setx GITHUB_PAT "your-new-token-here"
   ```

2. The MCP config now references `${GITHUB_PAT}` instead of the actual token

## ✅ Step 4: Verify Configuration

1. Restart Claude Desktop
2. Check that GitHub MCP server is working
3. The token is now safely stored in your environment variables

## 🛡️ Security Best Practices

### DO:
- ✅ Use environment variables for sensitive data
- ✅ Rotate tokens regularly (every 90 days)
- ✅ Use minimal required scopes
- ✅ Add `.env.mcp` to `.gitignore`

### DON'T:
- ❌ Commit tokens to git
- ❌ Share configuration files with tokens
- ❌ Use tokens with excessive permissions
- ❌ Store tokens in plain text files

## 📁 Files Created

1. **`.env.mcp`** - Template for environment variables (not committed to git)
2. **`setup-mcp-token.bat`** - Helper script to set up token
3. **Updated `claude_desktop_config.json`** - Now uses `${GITHUB_PAT}` variable

## 🔄 Token Rotation

Set a reminder to rotate your token every 90 days:
1. Create new token with same permissions
2. Update `GITHUB_PAT` environment variable
3. Delete old token from GitHub

## 📞 Need Help?

If you encounter issues:
1. Check that `GITHUB_PAT` environment variable is set
2. Ensure Claude Desktop was restarted after setting the variable
3. Verify token has correct permissions
4. Check MCP server logs in Claude Desktop

Remember: Security is not optional! Always protect your access tokens.