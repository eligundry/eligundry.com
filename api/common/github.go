package common

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"time"

	"github.com/pkg/errors"
)

var client = http.Client{
	Timeout: time.Second * 30,
}

func TriggerGithubActionsDeployOfSite() error {
	if len(os.Getenv("GITHUB_TOKEN")) == 0 {
		return errors.New("GITHUB_TOKEN env var is not set")
	}

	payload, err := json.Marshal(map[string]string{
		"ref": "gatsby-learnings",
	})

	if err != nil {
		return err
	}

	req, err := http.NewRequest(
		"POST",
		"https://api.github.com/repos/eligundry/eligundry.com/actions/workflows/149594/dispatches",
		bytes.NewBuffer(payload),
	)

	if err != nil {
		return err
	}

	req.Header.Add("Authorization", fmt.Sprintf("token %s", os.Getenv("GITHUB_TOKEN")))

	resp, err := client.Do(req)

	if err != nil {
		return err
	}

	defer resp.Body.Close()

	if resp.StatusCode != http.StatusNoContent {
		body, err := ioutil.ReadAll(resp.Body)

		if err != nil {
			return errors.Wrapf(
				err,
				"could not trigger GitHub Actions build (status code %d) and could not read request body",
				resp.StatusCode,
			)
		}

		return fmt.Errorf(
			"could not trigger GitHub Actions build (status code %d, body %s)",
			resp.StatusCode,
			body,
		)
	}

	return nil
}
