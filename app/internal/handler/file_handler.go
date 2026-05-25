package handler

import (
	"net/http"
	"os"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

type WriteFileRequest struct {
	Path    string `json:"path" binding:"required"`
	Content string `json:"content"`
}

func (h *Handler) ReadFile(c *gin.Context) {
	path := c.Query("path")
	if path == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "path is required"})
		return
	}

	// Security: prevent directory traversal
	path = filepath.Clean(path)
	if filepath.IsAbs(path) {
		// Only allow reading files in the working directory or below
		wd, _ := os.Getwd()
		if !isSubPath(path, wd) {
			c.JSON(http.StatusForbidden, gin.H{"error": "path is outside allowed directory"})
			return
		}
	}

	content, err := os.ReadFile(path)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"path": path, "content": string(content)})
}

func (h *Handler) WriteFile(c *gin.Context) {
	var req WriteFileRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	path := filepath.Clean(req.Path)
	if filepath.IsAbs(path) {
		wd, _ := os.Getwd()
		if !isSubPath(path, wd) {
			c.JSON(http.StatusForbidden, gin.H{"error": "path is outside allowed directory"})
			return
		}
	}

	// Ensure parent directory exists
	dir := filepath.Dir(path)
	if err := os.MkdirAll(dir, 0755); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if err := os.WriteFile(path, []byte(req.Content), 0644); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "saved", "path": path})
}

func (h *Handler) ListFiles(c *gin.Context) {
	dir := c.Query("dir")
	if dir == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "dir is required"})
		return
	}

	dir = filepath.Clean(dir)
	info, err := os.Stat(dir)
	if err != nil || !info.IsDir() {
		// Auto-create directory if it doesn't exist
		if err := os.MkdirAll(dir, 0755); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"dir": dir, "files": []interface{}{}})
		return
	}

	entries, err := os.ReadDir(dir)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	type FileEntry struct {
		Name  string `json:"name"`
		IsDir bool   `json:"is_dir"`
		Size  int64  `json:"size"`
	}

	files := make([]FileEntry, 0, len(entries))
	for _, e := range entries {
		info, _ := e.Info()
		size := int64(0)
		if info != nil {
			size = info.Size()
		}
		files = append(files, FileEntry{
			Name:  e.Name(),
			IsDir: e.IsDir(),
			Size:  size,
		})
	}

	c.JSON(http.StatusOK, gin.H{"dir": dir, "files": files})
}

func (h *Handler) DeleteFile(c *gin.Context) {
	path := c.Query("path")
	if path == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "path is required"})
		return
	}

	path = filepath.Clean(path)
	if filepath.IsAbs(path) {
		wd, _ := os.Getwd()
		if !isSubPath(path, wd) {
			c.JSON(http.StatusForbidden, gin.H{"error": "path is outside allowed directory"})
			return
		}
	}

	if err := os.Remove(path); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "deleted", "path": path})
}

func isSubPath(path, base string) bool {
	rel, err := filepath.Rel(base, path)
	if err != nil {
		return false
	}
	return !filepath.IsAbs(rel) && rel != ".." && !filepath.HasPrefix(rel, ".."+string(filepath.Separator))
}
