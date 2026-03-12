# 🚀 Dual Environment Workflow Guide
## Production vs Staging Setup for Brand Refresh

---

## 📋 **Environment Overview**

### **Production Environment** 🌐
- **Location**: Root directory (`/`)
- **Server**: Port 8080 (`python -m http.server 8080`)
- **URL**: `http://localhost:8080/`
- **Purpose**: Live, stable version of your Hub
- **Status**: Protected - only deploy tested changes

### **Staging Environment** 🧪
- **Location**: `staging-brand-refresh/` directory
- **Server**: Port 8081 (`node staging-server.js`)
- **URL**: `http://localhost:8081/`
- **Purpose**: Development and testing for brand refresh
- **Status**: Safe for experimentation

---

## 🔄 **Daily Workflow Process**

### **1. Starting Your Development Session**

```bash
# Start staging server
./start-staging-server.bat
# OR
node staging-server.js
```

**Staging URLs Available:**
- Main Hub: `http://localhost:8081/`
- IMC Services: `http://localhost:8081/IMCServices/`
- Advisory: `http://localhost:8081/advisory/`

### **2. Making Changes in Staging**

1. **Navigate to staging directory**:
   ```
   cd staging-brand-refresh/
   ```

2. **Edit files directly in staging**:
   - All changes are isolated from production
   - Refresh browser to see changes instantly
   - No risk to live site

3. **Test changes**:
   - Use staging URLs to preview
   - Test across different devices/browsers
   - Verify functionality before promoting

### **3. Version Control Best Practices**

```bash
# Create feature branch for brand refresh work
git checkout -b brand-refresh-staging

# Stage and commit staging changes
git add staging-brand-refresh/
git commit -m "Brand refresh: [describe changes]"

# Push staging branch
git push origin brand-refresh-staging
```

---

## 🚀 **Deployment Process**

### **Option A: File-by-File Promotion** (Recommended)
```bash
# Copy specific updated files from staging to production
copy "staging-brand-refresh/IMCServices/index.html" "IMCServices/index.html"
copy "staging-brand-refresh/assets/css/new-styles.css" "assets/css/new-styles.css"

# Test in production
# Commit production changes
git add .
git commit -m "Deploy: [specific changes from staging]"
git push origin master
```

### **Option B: Complete Staging Promotion** (Major releases)
```bash
# Backup current production (safety net)
git checkout -b production-backup-$(date +%Y%m%d)
git push origin production-backup-$(date +%Y%m%d)

# Replace production with staging content
robocopy "staging-brand-refresh" "." /E /XD ".git" "staging-brand-refresh"

# Commit and deploy
git add .
git commit -m "Major brand refresh deployment"
git push origin master
```

---

## 🔙 **Rollback Procedures**

### **Quick Rollback** (Recent changes)
```bash
# Revert last commit
git revert HEAD
git push origin master
```

### **Full Rollback** (Major issues)
```bash
# Restore from backup branch
git checkout production-backup-[date]
git checkout -b emergency-restore
git push origin emergency-restore

# Merge restore to master
git checkout master
git merge emergency-restore
git push origin master
```

---

## 📁 **File Syncing Strategy**

### **Local Development → Staging**
- **Method**: Direct editing in `staging-brand-refresh/`
- **Sync**: Immediate (files are local)
- **Testing**: Refresh staging server browser

### **Staging → Production**
- **Method**: Selective file copying or full directory sync
- **Verification**: Always test in production before final commit
- **Backup**: Create backup branch before major changes

---

## 🌐 **Server Management**

### **Starting Servers**

**Production Server** (Port 8080):
```bash
python -m http.server 8080
```

**Staging Server** (Port 8081):
```bash
node staging-server.js
# OR
./start-staging-server.bat
```

### **Server URLs**

| Environment | Port | Main Hub | IMC Services | Advisory |
|-------------|------|----------|--------------|----------|
| **Production** | 8080 | `localhost:8080/` | `localhost:8080/IMCServices/` | `localhost:8080/advisory/` |
| **Staging** | 8081 | `localhost:8081/` | `localhost:8081/IMCServices/` | `localhost:8081/advisory/` |

---

## ⚡ **Quick Commands Reference**

```bash
# Start staging development
./start-staging-server.bat

# Check git status
git status

# Create feature branch
git checkout -b feature-name

# Stage staging changes
git add staging-brand-refresh/

# Commit with message
git commit -m "Staging: description"

# Copy file from staging to production
copy "staging-brand-refresh/path/file.html" "path/file.html"

# Deploy to production
git add .
git commit -m "Deploy: description"
git push origin master
```

---

## 🎯 **Brand Refresh Workflow**

1. **🧪 Develop in Staging**
   - Make all brand changes in `staging-brand-refresh/`
   - Test thoroughly on `localhost:8081`
   - Iterate and refine

2. **✅ Validate Changes**
   - Cross-browser testing
   - Mobile responsiveness
   - Performance checks
   - Functionality verification

3. **🚀 Deploy to Production**
   - Copy validated files to production
   - Test on `localhost:8080`
   - Commit and push to master

4. **📊 Monitor & Iterate**
   - Monitor production performance
   - Gather feedback
   - Continue development in staging

---

## 🛡️ **Safety Guidelines**

- ✅ **Always test in staging first**
- ✅ **Create backup branches before major changes**
- ✅ **Use descriptive commit messages**
- ✅ **Test production after deployment**
- ❌ **Never edit production files directly**
- ❌ **Don't skip staging validation**
- ❌ **Avoid pushing untested changes**

---

## 🆘 **Troubleshooting**

### **Staging Server Won't Start**
```bash
# Check if port 8081 is in use
netstat -an | findstr :8081

# Kill process if needed
taskkill /F /PID [process_id]
```

### **Files Not Updating**
- Clear browser cache (Ctrl+F5)
- Check file permissions
- Verify correct directory

### **Git Issues**
```bash
# Reset to last known good state
git reset --hard HEAD~1

# Force push (use carefully)
git push --force origin branch-name
```

---

**🎉 Ready to start your brand refresh journey!**

*This workflow ensures safe, controlled development while maintaining production stability.*