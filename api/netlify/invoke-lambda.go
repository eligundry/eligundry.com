package netlify

import (
	"context"
	"encoding/json"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/lambda"
	"github.com/pkg/errors"
)

var lambdaClient *lambda.Lambda

func InvokeBuildLambda(ctx context.Context, triggerTitle string) error {
	payload, err := json.Marshal(map[string]string{
		"title": triggerTitle,
	})

	if err != nil {
		return err
	}

	resp, err := lambdaClient.InvokeWithContext(ctx, &lambda.InvokeInput{
		FunctionName: aws.String("staticSiteBuildTrigger"),
		Payload:      payload,
	})

	if err != nil {
		return errors.Wrap(err, "error calling staticSiteBuildTrigger")
	}

	if *resp.StatusCode != 200 {
		return errors.Wrapf(err, "error calling staticSiteBuildTrigger, status code %d", resp.StatusCode)
	}

	return nil
}

func init() {
	sess := session.Must(session.NewSessionWithOptions(session.Options{
		SharedConfigState: session.SharedConfigEnable,
	}))

	lambdaClient = lambda.New(sess)
}
