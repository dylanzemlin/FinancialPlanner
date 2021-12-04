#!/bin/bash

# This file prevents vercel from building non production versions
if [[ "$VERCEL_ENV" == "production" ]] ; then
    exit 1;
else
    exit 0;
fi