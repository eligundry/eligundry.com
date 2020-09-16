package common

import (
	"context"
	"fmt"
	"mime/multipart"
	"os"
	"path/filepath"

	"github.com/google/uuid"
	minio "github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
	"github.com/pkg/errors"
)

type DigitalOceanSpacesClient struct {
	minioClient *minio.Client
	ctx         context.Context
}

func NewDigitalOceanSpacesClient() (*DigitalOceanSpacesClient, error) {
	doSpacesClient := DigitalOceanSpacesClient{
		ctx: context.Background(),
	}

	// validate the config before trying to construct the object
	if err := validateSpacesConfig(); err != nil {
		return &doSpacesClient, err
	}

	minioClient, err := minio.New(os.Getenv("DO_SPACES_ENDPOINT")+":443", &minio.Options{
		Creds: credentials.NewStaticV4(
			os.Getenv("DO_ACCESS_KEY"),
			os.Getenv("DO_SECRET_KEY"),
			"",
		),
		Secure: true,
	})

	if err != nil {
		return &doSpacesClient, errors.Wrap(err, "could not construct minio.Client")
	}

	doSpacesClient.minioClient = minioClient

	return &doSpacesClient, nil
}

func validateSpacesConfig() error {
	requiredEnvVars := []string{
		"DO_SPACES_ENDPOINT",
		"DO_ACCESS_KEY",
		"DO_SECRET_KEY",
		"DO_SPACES_BUCKET",
	}

	for _, env := range requiredEnvVars {
		if len(os.Getenv(env)) == 0 {
			return fmt.Errorf("%s must be defined", env)
		}
	}

	return nil
}

type UploadMultipartArgs struct {
	FileHeader     *multipart.FileHeader
	Path           string
	Public         bool
	RandomFilename bool
	Metadata       map[string]string
}

func (dos *DigitalOceanSpacesClient) UploadMultipart(args *UploadMultipartArgs) (minio.UploadInfo, error) {
	file, err := args.FileHeader.Open()

	if err != nil {
		return minio.UploadInfo{}, err
	}

	defer file.Close()

	filename := args.FileHeader.Filename
	opts := minio.PutObjectOptions{
		ContentType: args.FileHeader.Header.Get("Content-Type"),
	}

	if args.Metadata != nil {
		opts.UserMetadata = args.Metadata
	} else {
		opts.UserMetadata = map[string]string{}
	}

	if args.Public {
		opts.UserMetadata["x-amz-acl"] = "public-read"
	}

	if args.RandomFilename {
		ext := filepath.Ext(filename)
		filename = uuid.New().String() + ext
	}

	info, err := dos.minioClient.PutObject(
		dos.ctx,
		os.Getenv("DO_SPACES_BUCKET"),
		filepath.Join(args.Path, filename),
		file,
		args.FileHeader.Size,
		opts,
	)

	if err != nil {
		return minio.UploadInfo{}, err
	}

	return info, nil
}

func (dos *DigitalOceanSpacesClient) RemoveObject(objectName string) error {
	err := dos.minioClient.RemoveObject(
		dos.ctx,
		os.Getenv("DO_SPACES_BUCKET"),
		objectName,
		minio.RemoveObjectOptions{},
	)

	if err != nil {
		return err
	}

	return nil
}
