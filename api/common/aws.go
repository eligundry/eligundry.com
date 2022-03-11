package common

import "os"

func IsInLambda() bool {
	return len(os.Getenv("AWS_LAMBDA_FUNCTION_NAME")) > 0
}
