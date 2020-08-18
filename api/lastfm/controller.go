package lastfm

import (
	"fmt"
	"net/http"
	"net/http/httputil"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(router *gin.RouterGroup) {
	routes := router.Group("/last.fm")
	{
		routes.GET("", TestRoute)
		routes.GET("/collage.jpg", LastfmAlbumCollage)
	}
}

func LastfmAlbumCollage(c *gin.Context) {
	director := func(req *http.Request) {
		req.URL.Scheme = "https"
		req.URL.Host = "www.tapmusic.net"
		req.URL.Path = "/collage.php"

		q := req.URL.Query()
		q.Add("user", "eli_pwnd")
		q.Add("type", c.DefaultQuery("type", "7day"))
		q.Add("size", c.DefaultQuery("size", "3x3"))
		req.URL.RawQuery = q.Encode()
	}
	proxy := &httputil.ReverseProxy{
		FlushInterval: -1,
		Director:      director,
		ModifyResponse: func(resp *http.Response) error {
			resp.Header.Del("cache-control")
			resp.Header.Add("cache-control", fmt.Sprintf("public, max-age=%d", 60*60*24))

			return nil
		},
	}

	proxy.ServeHTTP(c.Writer, c.Request)
}

func TestRoute(c *gin.Context) {
	tracks, err := GetRecentTracks(&UserGetRecentTracksArgs{})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	pts, err := UserGetRecentTracksToProcessedTracks(tracks)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
	}

	c.JSON(http.StatusOK, pts)
}
