package handler

import (
	"database/sql"
	"cove/internal/config"
	"cove/internal/docker"
	"cove/internal/service"
)

type Handler struct {
	imageService   *service.ImageService
	dockerService  *docker.DockerService
	webhookService *service.WebhookService
	cfg            *config.Config
	db             *sql.DB
}

func NewHandler(imageService *service.ImageService, dockerService *docker.DockerService, webhookService *service.WebhookService, cfg *config.Config, db *sql.DB) *Handler {
	return &Handler{
		imageService:   imageService,
		dockerService:  dockerService,
		webhookService: webhookService,
		cfg:            cfg,
		db:             db,
	}
}
