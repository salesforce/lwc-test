#!/bin/bash

# Copyright (c) 2018, salesforce.com, inc.
# All rights reserved.
# SPDX-License-Identifier: MIT
# For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT

# Normalize params
PACKAGE_VERSION="$1"
TAG_NAME="$2"

if [ -z "${PACKAGE_VERSION}" ]; then
        echo "You must specify a version to release"
        echo "Comand options: semver tagName (ex: 0.12.1 next)"
        exit 1;
fi

if [ -z "${TAG_NAME}" ]; then
        echo "You must specify a tagname"
        echo "Comand options: semver tagName (ex: 0.12.1 next)"
        exit 1;
fi

TAG="--dist-tag $TAG_NAME"

# Get the current version
version=`lerna ls --json --scope @lwc/jest-preset`

if [[ $version = *"${PACKAGE_VERSION}"* ]]; then
  echo "Version already available, skipping release."
  exit 0;
fi

# Command to push the packages
CMD_UPDATE_VERSION="lerna version ${PACKAGE_VERSION} --yes --exact --force-publish --no-git-tag-version --no-push"
CMD_PUBLISH_PACKAGES="lerna publish ${PACKAGE_VERSION} ${TAG} --yes --force-publish --no-git-tag-version --no-push --no-verify-access"

# Update package version.
echo $CMD_UPDATE_VERSION;
$CMD_UPDATE_VERSION;

# Commit the version changes
git add lerna.json packages/*;
git commit -m "release: v${PACKAGE_VERSION}";
git tag "v${PACKAGE_VERSION}" -m "v${PACKAGE_VERSION}"

# Publish the packages to npm.
echo "Publishing artifacts for v${PACKAGE_VERSION}"
echo $CMD_PUBLISH_PACKAGES;
$CMD_PUBLISH_PACKAGES;
