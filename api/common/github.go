package common

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"
)

var client = http.Client{
	Timeout: time.Second * 30,
}

func TriggerGithubActionsDeployOfSite() error {
	payload, err := json.Marshal(map[string]string{
		"ref": "master",
	})

	if err != nil {
		return err
	}

	req, err := http.NewRequest(
		"POST",
		"https://api.github.com/repos/eligundry/eligundry.com/actions/workflows/docker-build/dispatches",
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

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("could not trigger GitHub Actions build (status code %d)", resp.StatusCode)
	}

	return nil
}
