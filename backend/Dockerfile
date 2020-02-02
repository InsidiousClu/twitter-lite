FROM golang:1.13-alpine AS build

ADD . /go/src/twitter_backend
WORKDIR /go/src/twitter_backend
ENV GO111MODULE=on

COPY go.mod .
COPY go.sum .
RUN go mod download

FROM build as app_build
COPY . .
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -a -o /go/bin/twitter_backend ./cmd/main.go

FROM alpine:3.10 AS run_env
COPY --from=app_build /go/bin/twitter_backend /bin/twitter_backend

CMD ["/bin/twitter_backend"]