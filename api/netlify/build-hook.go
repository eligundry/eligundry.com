package netlify

import (
	"bytes"
	"context"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
	"os"
	"time"

	"github.com/pkg/errors"
)

var client = http.Client{
	Timeout: time.Second * 30,
}

func TriggerDeploy(ctx context.Context, triggerTitle string) error {
	rawBuildHookURL := os.Getenv("NETLIFY_BUILD_HOOK")

	if len(rawBuildHookURL) == 0 {
		return errors.New("NETLIFY_BUILD_HOOK env var is not set")
	}

	buildHookURL, err := url.Parse(rawBuildHookURL)

	if err != nil {
		return errors.Wrap(err, "could not parse NETLIFY_BUILD_HOOK in to url")
	}

	query := buildHookURL.Query()
	query.Add("trigger_title", triggerTitle)
	buildHookURL.RawQuery = query.Encode()

	req, err := http.NewRequestWithContext(
		ctx,
		"POST",
		buildHookURL.String(),
		bytes.NewBuffer([]byte("{}")),
	)

	if err != nil {
		return err
	}

	resp, err := client.Do(req)

	if err != nil {
		return err
	}

	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, err := ioutil.ReadAll(resp.Body)

		if err != nil {
			return errors.Wrapf(
				err,
				"could not trigger Netlify build (status code %d) and could not read request body",
				resp.StatusCode,
			)
		}

		return fmt.Errorf(
			"could not trigger Netlify build (status code %d, body %s)",
			resp.StatusCode,
			body,
		)
	}

	return nil
}
