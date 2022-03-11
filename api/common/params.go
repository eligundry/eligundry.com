package common

import (
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/pkg/errors"
)

func GetIDParam(c *gin.Context, key string) (int64, error) {
	id, err := strconv.ParseInt(c.Param(key), 10, 64)

	if err != nil {
		return 0, errors.Wrapf(err, "could convert %s to int", key)
	}

	return id, nil
}
