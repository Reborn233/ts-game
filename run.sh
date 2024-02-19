#!/bin/sh
cd ./dist
git init
git config user.name "reborn233"
git config user.email "499289113@qq.com"
git add .
git commit -m "Travis CI Auto Builder at `date +"%Y-%m-%d %H:%M"`"
git push --force --quiet "https://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@github.com/Reborn233/ts-game.git" master:gh-pages
