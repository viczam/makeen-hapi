#!/bin/bash
set -ea

curl -s http://localhost:3000/documentation | grep window.swaggerUi

exit 0