package common

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

type messages struct {
	StatusCode string
}

type errorMiddlewareTestCase struct {
	Errors      []error
	ExpectedKey string
	StatusCode  int
	Messages    messages
}

type nestedError struct {
	Error *string `json:"error"`
}

type errorBody struct {
	Error  *string       `json:"error"`
	Errors []nestedError `json:"errors"`
}

func TestErrorHandlerMiddleware(t *testing.T) {
	assert := assert.New(t)
	testCases := []errorMiddlewareTestCase{
		{
			Errors:      []error{fmt.Errorf("%s: payload is bad bro", BadRequestPrefix)},
			ExpectedKey: "error",
			StatusCode:  http.StatusBadRequest,
			Messages: messages{
				StatusCode: "should be 400 because of the BadRequestPrefix",
			},
		},
		{
			Errors:      []error{fmt.Errorf("%s: resource is not found bro", NotFoundPrefix)},
			ExpectedKey: "error",
			StatusCode:  http.StatusNotFound,
			Messages: messages{
				StatusCode: "should by 404 because of the NotFoundPrefix",
			},
		},
		{
			Errors:      []error{errors.New("generic error bro")},
			ExpectedKey: "error",
			StatusCode:  http.StatusInternalServerError,
			Messages: messages{
				StatusCode: "should be 500 because it's a generic error",
			},
		},
		{
			Errors: []error{
				errors.New("generic error bro"),
				fmt.Errorf("%s: resource is not found bro", NotFoundPrefix),
			},
			ExpectedKey: "errors",
			StatusCode:  http.StatusNotFound,
			Messages: messages{
				StatusCode: "should be 404 because at least one error has the NotFoundPrefix",
			},
		},
	}

	for _, testCase := range testCases {
		resp := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(resp)

		for _, err := range testCase.Errors {
			c.Error(err)
		}

		ErrorHandlerMiddleware(c)

		assert.Equal(
			testCase.StatusCode,
			resp.Result().StatusCode,
			testCase.Messages.StatusCode,
		)

		rawBody, err := ioutil.ReadAll(resp.Body)
		assert.NoError(err)
		var responseBody errorBody
		err = json.Unmarshal(rawBody, &responseBody)
		assert.NoError(err)

		if len(testCase.Errors) == 1 {
			assert.NotNil(responseBody.Error, "should have the error key filled in because there was one error")
		} else {
			assert.Len(responseBody.Errors, len(testCase.Errors))
		}
	}

}
